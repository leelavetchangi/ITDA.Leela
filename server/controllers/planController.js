const mongoose = require('mongoose');
const Plan = require('../models/Plan');

function validatePlanInput({ name, durationInDays, price }) {
  if (typeof name !== 'string' || !name.trim()) {
    return 'Name is required';
  }

  if (!Number.isInteger(durationInDays) || durationInDays < 1) {
    return 'durationInDays must be a positive integer';
  }

  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
    return 'Price must be a non-negative number';
  }

  return null;
}

function isValidPlanId(id) {
  return mongoose.isValidObjectId(id);
}

async function createPlan(req, res) {
  const validationError = validatePlanInput(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const plan = await Plan.create({
    name: req.body.name.trim(),
    durationInDays: req.body.durationInDays,
    price: req.body.price,
  });

  return res.status(201).json(plan);
}

async function listPlans(req, res) {
  const requestedPage = Number.parseInt(req.query.page, 10);
  const requestedLimit = Number.parseInt(req.query.limit, 10);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
    ? Math.min(requestedLimit, 100)
    : 10;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Plan.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Plan.countDocuments(),
  ]);

  return res.json({
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

async function getPlan(req, res) {
  if (!isValidPlanId(req.params.id)) {
    return res.status(404).json({ message: 'Plan not found' });
  }

  const plan = await Plan.findById(req.params.id);

  if (!plan) {
    return res.status(404).json({ message: 'Plan not found' });
  }

  return res.json(plan);
}

async function updatePlan(req, res) {
  if (!isValidPlanId(req.params.id)) {
    return res.status(404).json({ message: 'Plan not found' });
  }

  const validationError = validatePlanInput(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const plan = await Plan.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name.trim(),
      durationInDays: req.body.durationInDays,
      price: req.body.price,
    },
    { returnDocument: 'after', runValidators: true }
  );

  if (!plan) {
    return res.status(404).json({ message: 'Plan not found' });
  }

  return res.json(plan);
}

async function deletePlan(req, res) {
  if (!isValidPlanId(req.params.id)) {
    return res.status(404).json({ message: 'Plan not found' });
  }

  const plan = await Plan.findByIdAndDelete(req.params.id);

  if (!plan) {
    return res.status(404).json({ message: 'Plan not found' });
  }

  return res.json({ message: 'Plan deleted successfully' });
}

module.exports = {
  createPlan,
  listPlans,
  getPlan,
  updatePlan,
  deletePlan,
};