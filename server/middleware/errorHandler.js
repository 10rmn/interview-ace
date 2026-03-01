const errorHandler = (err, req, res, next) => {
  // Default error
  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Server Error',
  };

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    error.statusCode = 400;
    error.message = `${field} already exists`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.statusCode = 401;
    error.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    error.statusCode = 401;
    error.message = 'Token expired';
  }

  // Validation error
  if (err.name === 'ValidationError') {
    error.statusCode = 400;
    error.message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Cast error
  if (err.name === 'CastError') {
    error.statusCode = 400;
    error.message = 'Invalid ID format';
  }

  res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
