import express from 'express';
import { verifyAgentToken } from '../utils/verifyToken.js';
import { deleteagent, updateagent, verifynewlisting, verifyrecentlisting, newCount } from '../controller/agent.contoller.js';
import { addAgent } from '../utils/addAgent.js';

const router = express.Router();

router.post('/update/:id',verifyAgentToken,updateagent);
router.post('/addAgent',addAgent);
router.delete('/delete/:id',verifyAgentToken,deleteagent);
router.get('/verifyNewReq/:id',verifyAgentToken,verifynewlisting);
router.get('/verifyRecentReq/:id',verifyAgentToken,verifyrecentlisting);
router.get('/newCount/:id',verifyAgentToken,newCount);


export default router;