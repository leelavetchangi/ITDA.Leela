const express = require('express');
const {
  createPlan,
  deletePlan,
  getPlan,
  listPlans,
  updatePlan,
} = require('../controllers/planController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.post('/', createPlan);
router.get('/', listPlans);
router.get('/:id', getPlan);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);

module.exports = router;