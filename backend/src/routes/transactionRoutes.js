import express from 'express';
import { createPledge, getTransactions } from '../controllers/transactionController.js';

const router = express.Router();

router.route('/')
  .get(getTransactions)
  .post(createPledge);

export default router;