import express from 'express';
import { listing,verifiedlisting,pendinglisting,rejectedlisting, permlisting, soldlisting,listedProp } from '../controller/list.controller.js';
import { verifyUserToken } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/addPropReq',verifyUserToken,listing);
router.get('/pendingReq/:id',verifyUserToken,pendinglisting);
router.get('/rejectedReq/:id',verifyUserToken,rejectedlisting);
router.get('/verifiedReq/:id',verifyUserToken,verifiedlisting);
router.get('/soldProperty/:id',verifyUserToken,soldlisting);
router.get('/verifiedProp/:id',verifyUserToken,permlisting);
router.get('/listedProp',listedProp);

export default router;