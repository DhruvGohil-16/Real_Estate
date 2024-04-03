import express from 'express';
import { verifyAgentToken } from '../utils/verifyToken.js';
import { deleteagent, updateagent, 
    verifynewlisting, verifyrecentlisting,verifynewBuylisting,verifyRecentBuylisting,
    updatelisting,updateNewCount,updateNewBuyCount,totallisting,updateBuylisting,
    totalReqCount,newBuyCount, newCount } from '../controller/agent.contoller.js';
import { addAgent } from '../utils/addAgent.js';

const router = express.Router();

router.post('/update/:id',verifyAgentToken,updateagent);
router.post('/addAgent',addAgent);
router.delete('/delete/:id',verifyAgentToken,deleteagent);
router.get('/verifyNewReq/:id',verifyAgentToken,verifynewlisting);
router.get('/verifyRecentReq/:id',verifyAgentToken,verifyrecentlisting);
router.get('/NewBuyReq/:id',verifyAgentToken,verifynewBuylisting);
router.get('/RecentBuyReq/:id',verifyAgentToken,verifyRecentBuylisting);
router.get('/totalReq/:id',verifyAgentToken,totallisting);
router.patch('/verify/:id',verifyAgentToken,updatelisting);
router.get('/newCount/:id',verifyAgentToken,newCount);
router.get('/newBuyCount/:id',verifyAgentToken,newBuyCount);
router.patch('/updateListReq/:id',verifyAgentToken,updateBuylisting);
router.get('/totalReqCount/:id',verifyAgentToken,totalReqCount);
router.patch('/updateNewCount/:id',verifyAgentToken,updateNewCount);
router.patch('/updateNewBuyCount/:id',verifyAgentToken,updateNewBuyCount);

export default router;