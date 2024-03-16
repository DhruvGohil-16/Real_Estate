import express from 'express';
import { listing } from '../controller/list.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/list',verifyToken,listing);

export default router;