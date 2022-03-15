// const express = require('express');
// const session = require('express-session');
// const SequelizeStore = require('connect-session-sequelize')(session.Store);
// const helpers = require('./utils/helpers');
// const routes = ('./controllers/');
// const path = require('path');
// const app = express();

// // const routes = require('./controllers/');
// const sequelize = require('./config/connection');

// const exphbs = require('express-handlebars');
// const hbs = exphbs.create({ helpers });

// const sess = {
//     secret: 'My secret',
//     cookie: {},
//     resave: false,
//     saveUninitiated: true,
//     store: new SequelizeStore({
//         db: sequelize
//     })
// };

// app.use(session(sess));

// // Templating engine
// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');

// const PORT = process.env.PORT || 3001;

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, 'public')));

// app.use(routes);



// sequelize.sync({ force: false }).then(() => {
//     app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
// });

const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
require('dotenv').config()

const app = express();
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});


const PORT = process.env.PORT || 3000;

const sequelize = require("./config/connection");
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

const helpers = require('./utils/helpers');

const hbs = exphbs.create({ helpers });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./controllers/'));

// sequelize.sync({ force: false }).then(() => {
//   app.listen(PORT, () => console.log('Now listening'));
// });
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
