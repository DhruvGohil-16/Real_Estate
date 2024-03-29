import express from 'express';
import { listing,verifiedlisting,pendinglisting } from '../controller/list.controller.js';
import { verifyUserToken } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/addPropReq',verifyUserToken,listing);
router.get('/pendingReq/:id',verifyUserToken,pendinglisting);
router.get('/verifiedReq/:id',verifyUserToken,verifiedlisting);

export default router;