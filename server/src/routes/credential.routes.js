import { Router } from 'express';
import { issueCredential, revokeCredential, listCredentials } from '../controllers/credential.controller.js';
import { requireAuth, authorizeRoles } from '../middleware/auth.middleware.js';
import { USER_ROLES } from '../models/user.model.js';

const router = Router();

// Secure all routes in this router
router.use(requireAuth);
router.use(authorizeRoles(USER_ROLES.INSTITUTION));

router.post('/issue', issueCredential);
router.post('/revoke/:id', revokeCredential);
router.get('/', listCredentials);

export default router;
