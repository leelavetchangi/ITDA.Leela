function errorHandler(error, _req, res, _next) {
  console.error(error);

  if (error.code === 11000) {
    return res.status(400).json({ message: 'A record with that value already exists' });
  }

  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors).map((item) => item.message).join(', ');
    return res.status(400).json({ message });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid request value' });
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ message: 'Request body must be valid JSON' });
  }

  return res.status(error.statusCode || 500).json({
    message: error.statusCode ? error.message : 'Internal server error',
  });
}

module.exports = errorHandler;