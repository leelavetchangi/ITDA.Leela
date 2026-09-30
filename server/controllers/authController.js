const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function validateRegistrationInput(name, email, password) {
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }

  if (!email || typeof email !== 'string' || !emailPattern.test(email.trim())) {
    return 'A valid email is required';
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return 'Password must be at least 6 characters';
  }

  return null;
}

async function register(req, res) {
  const { name, email, password } = req.body;
  const validationError = validateRegistrationInput(name, email, password);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return res.status(400).json({ message: 'Email is already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  return res.status(201).json({
    token: createToken(user.id),
    user,
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
  const passwordMatches = user && (await bcrypt.compare(password, user.password));

  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  return res.json({
    token: createToken(user.id),
    user,
  });
}

async function me(req, res) {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(401).json({ message: 'User no longer exists' });
  }

  return res.json({ user });
}

module.exports = { register, login, me };