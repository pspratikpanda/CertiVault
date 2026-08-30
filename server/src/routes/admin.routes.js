import { Router } from 'express';
import { getPlaygroundData, tamperCredential } from '../services/admin.service.js';
import { requireAuth, authorizeRoles } from '../middleware/auth.middleware.js';
import { USER_ROLES } from '../models/user.model.js';
import User from '../models/user.model.js';

const router = Router();

// All admin routes require authentication
router.use(requireAuth);

// Demo-only: promote self to ADMIN role (disabled in production)
router.post('/promote-self', async (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return next({ status: 403, message: 'Not available in production.' });
  }
  try {
    await User.updateOne({ _id: req.user._id }, { $set: { role: USER_ROLES.ADMIN } });
    res.json({ success: true, message: 'Role elevated to ADMIN for this demo session. Please log out and log back in.' });
  } catch (e) {
    next(e);
  }
});

// Read-only: any authenticated user can view playground data
router.get('/playground', async (req, res, next) => {
  try {
    const result = await getPlaygroundData();
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
});

// Destructive: only ADMIN role can tamper with credential data
router.post('/tamper/:id', authorizeRoles(USER_ROLES.ADMIN), async (req, res, next) => {
  try {
    const result = await tamperCredential(req.params.id);
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
});

export default router;
