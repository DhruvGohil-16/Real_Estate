import express from 'express';
import { listing } from '../controller/list.controller.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/list',verifyToken,listing);

export default router;