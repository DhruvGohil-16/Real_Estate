import express from 'express';
import { verifyAgentToken } from '../utils/verifyToken.js';
import { deleteagent, updateagent } from '../controller/agent.contoller.js';

const router = express.Router();

router.post('/update/:id',verifyAgentToken,updateagent);
router.delete('/delete/:id',verifyAgentToken,deleteagent);

export default router;