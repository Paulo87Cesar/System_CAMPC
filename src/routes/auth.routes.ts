import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import passport from 'passport';

const router = Router();

router.post('/login', AuthController.login);
router.get('/me', authMiddleware, AuthController.me);

// Google OAuth
router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
}));

router.get('/google/callback', 
    passport.authenticate('google', { session: false }), 
    AuthController.googleCallback
);

export default router;
