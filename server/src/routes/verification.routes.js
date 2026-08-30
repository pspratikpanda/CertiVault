import { Router } from 'express';
import { verifyPublicCredential } from '../controllers/credential.controller.js';

const router = Router();

// Public route, no auth middleware
router.get('/:id', verifyPublicCredential);

export default router;
