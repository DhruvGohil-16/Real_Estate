import express from 'express';
import { google, signup, signin } from '../controller/auth.controller.js';

const router = express.Router();

router.post('/sign-up',signup);
router.post('/sign-in',signin);
router.post('/googleAuth',google);

export default router;