import express from 'express';
import { signup } from '../controller/auth.controller.js';
import { signin } from '../controller/auth.controller.js';

const router = express.Router();

router.post('/sign-up',signup);
router.post('/sign-in',signin);

export default router;