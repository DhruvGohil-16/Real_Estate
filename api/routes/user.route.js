import express from 'express';
import { test, updateUser, deleteUser, userListing, buyReq } from '../controller/user.controller.js';
import { verifyUserToken } from '../utils/verifyToken.js';

const router = express.Router();

router.get('/test',test);
router.post('/update/:id',verifyUserToken,updateUser);
router.post('/buyReq/:id',verifyUserToken,buyReq);
router.delete('/delete/:id',verifyUserToken,deleteUser);
router.get('/user-listings/:username',verifyUserToken,userListing);

export default router;