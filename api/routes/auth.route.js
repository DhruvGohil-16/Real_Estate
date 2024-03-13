import express from 'express';
import { googleAuth, signup, signin, signout } from '../controller/auth.controller.js';

const router = express.Router();

router.post('/sign-up',signup);
router.post('/sign-in',signin);
router.get('/sign-out',signout);
router.post('/googleAuth',googleAuth);

export default router;