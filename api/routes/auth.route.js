import express from 'express';
import { googleAuth, signup, signin, signout, signinAgent, signoutAgent, signupAgent} from '../controller/auth.controller.js';

const router = express.Router();

router.post('/sign-up',signup);
router.post('/sign-in',signin);
router.get('/sign-out',signout);
router.post('/googleAuth',googleAuth);
router.post('/sign-up-agent',signupAgent);
router.post('/sign-in-agent',signinAgent);
router.get('/sign-out-agent',signoutAgent);

export default router;