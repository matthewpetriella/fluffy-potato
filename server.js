const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const helpers = require('./utils/helpers');

const path = require('path');
const app = express();

const routes = require('./controllers/');
const sequelize = require('./config/connection');

const exphbs = require('express-handlebars');
const hbs = exphbs.create({ helpers });

const sess = {
    secret: 'My secret',
    cookie: {},
    resave: false,
    saveUninitiated: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));

// Templating engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);


sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});