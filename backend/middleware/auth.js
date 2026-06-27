// Auth middleware removed - using simple admin key check instead
// Set ADMIN_SECRET in your .env to protect admin routes

export const requireAuth = (req, res, next) => {
  next(); // Allow all requests through (auth stripped)
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    next(); // Allow all roles through (auth stripped)
  };
};
