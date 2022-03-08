const router = require('express').Router();

const apiRoutes = require('./api'); // pulls the index file by default which has all others pooled to it
// const homeRoutes = require('./home-routes');
// const dashboardRoutes = require('./dashboard-routes');

router.use('/api', apiRoutes);
// router.use('/', homeRoutes);
// router.use('/dashboard', dashboardRoutes);


router.use((req, res) => {
    res.status(404).end();
});



module.exports = router;