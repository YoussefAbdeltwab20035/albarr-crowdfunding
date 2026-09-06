import express from 'express';
import {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  toggleVerifyCampaign,
  deleteCampaign
} from '../controllers/campaignController.js';

const router = express.Router();

router.route('/')
  .get(getCampaigns)
  .post(createCampaign);

router.route('/:id')
  .get(getCampaignById)
  .put(updateCampaign)
  .delete(deleteCampaign);

router.put('/:id/toggle-verify', toggleVerifyCampaign);

export default router;