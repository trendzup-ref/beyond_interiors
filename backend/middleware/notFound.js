/**
 * 404 Not Found Middleware
 * Handles requests to endpoints that do not exist.
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export default notFound;
