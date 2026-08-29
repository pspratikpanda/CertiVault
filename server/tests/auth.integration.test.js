/**
 * @file auth.integration.test.js
 * @description Exercises the complete Step 4 account/session behavior against an explicitly configured test MongoDB database.
 * @layer Server Test
 * @interacts Express app, MongoDB, User model and authentication routes.
 * @futureWork Add separate test databases for future credential workflows.
 * @nonGoal Do not run against a production or development database.
 */
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import test from 'node:test';

const testUri = process.env.MONGO_URI || '';

if (!testUri.includes('certivault_test')) {
  test('authentication integration suite requires certivault_test', { skip: 'Set MONGO_URI to a MongoDB database containing certivault_test.' }, () => {});
} else {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET ||= randomBytes(32).toString('hex');
  const [{ default: app }, { connectDatabase, disconnectDatabase }, { default: User, USER_ROLES }] = await Promise.all([
    import('../src/app.js'),
    import('../src/config/database.js'),
    import('../src/models/user.model.js'),
  ]);
  const suffix = randomBytes(6).toString('hex');
  const institutionEmail = `institution-${suffix}@example.test`;
  const adminEmail = `admin-${suffix}@example.test`;
  const password = 'Secure-test-password-2026';
  let server;
  let baseUrl;
  let institutionCookie;
  let adminCookie;

  const request = async (path, options = {}) => fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const cookieFrom = (response) => response.headers.get('set-cookie')?.split(';')[0] || '';

  test('Step 4 authentication flows', async (t) => {
    await connectDatabase();
    server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}/api`;
    t.after(async () => {
      await User.deleteMany({ email: { $in: [institutionEmail, adminEmail] } });
      await new Promise((resolve) => server.close(resolve));
      await disconnectDatabase();
    });

    await t.test('1. registration', async () => {
      const response = await request('/auth/register', { method: 'POST', body: JSON.stringify({ institutionName: 'Test Institution', email: institutionEmail, password }) });
      const body = await response.json();
      assert.equal(response.status, 201);
      assert.equal(body.data.user.role, USER_ROLES.INSTITUTION);
      assert.equal('password' in body.data.user, false);
    });

    await t.test('2. duplicate registration', async () => {
      const response = await request('/auth/register', { method: 'POST', body: JSON.stringify({ institutionName: 'Test Institution', email: institutionEmail, password }) });
      assert.equal(response.status, 409);
      assert.equal((await response.json()).error.code, 'ACCOUNT_ALREADY_EXISTS');
    });

    await t.test('3. valid login', async () => {
      const response = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email: institutionEmail, password }) });
      const body = await response.json();
      institutionCookie = cookieFrom(response);
      assert.equal(response.status, 200);
      assert.match(institutionCookie, /^certivault_session=/);
      assert.equal('token' in body.data, false);
    });

    await t.test('4. invalid login', async () => {
      const response = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email: institutionEmail, password: 'incorrect-password' }) });
      assert.equal(response.status, 401);
      assert.equal((await response.json()).error.code, 'INVALID_CREDENTIALS');
    });

    await t.test('5. protected route', async () => {
      const anonymous = await request('/auth/me');
      assert.equal(anonymous.status, 401);
      const authenticated = await request('/auth/me', { headers: { Cookie: institutionCookie } });
      assert.equal(authenticated.status, 200);
      assert.equal((await authenticated.json()).data.user.email, institutionEmail);
    });

    await t.test('6. logout', async () => {
      const response = await request('/auth/logout', { method: 'POST', headers: { Cookie: institutionCookie } });
      assert.equal(response.status, 200);
      assert.match(cookieFrom(response), /^certivault_session=/);
      const afterClear = await request('/auth/me', { headers: { Cookie: 'certivault_session=' } });
      assert.equal(afterClear.status, 401);
    });

    await t.test('7. role restriction', async () => {
      await User.create({ institutionName: 'Test Admin', email: adminEmail, password: await (await import('bcrypt')).default.hash(password, 12), role: USER_ROLES.ADMIN });
      const adminLogin = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email: adminEmail, password }) });
      adminCookie = cookieFrom(adminLogin);
      assert.equal(adminLogin.status, 200);
      const institutionDenied = await request('/auth/admin', { headers: { Cookie: institutionCookie } });
      assert.equal(institutionDenied.status, 403);
      const adminAllowed = await request('/auth/admin', { headers: { Cookie: adminCookie } });
      assert.equal(adminAllowed.status, 200);
    });
  });
}
