const withAuth = (req, res, next) => {
  if (!req.session.user_id) {
    if (req.originalUrl === 'login') {
      res.redirect('/login');
    } else {
      res.redirect('/login?_next=' + req.originalUrl);
    }
  } else {
    next();
  }
};

const withAuthApi = (req, res, next) => {
  if (!req.session.user_id) {
    res.status(403).json({ error: 'Access denied. You must be logged in to access this resource.'});
  } else {
    next();
  }
};
// allows us to limit functionality for users that are not signed in
module.exports = { withAuth, withAuthApi };
