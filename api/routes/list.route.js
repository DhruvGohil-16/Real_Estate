import express from 'express';
import { listing } from '../controller/list.controller.js';
import { verifyUserToken } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/addPropReq',verifyUserToken,listing);

export default router;