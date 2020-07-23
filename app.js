const express = require('express'),
         keys = require('./config/keys'),
       stripe = require('stripe')(keys.stripeSecretKey),
   bodyParser = require('body-parser'),
       exphbs = require('express-handlebars');

const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static folder
app.use(express.static(`${__dirname}/public`));

// Index route
app.get('/', (req, res) => {
    res.render('index', {
        stripePublishableKey: keys.stripePublishableKey
    });
});

app.get('/success', (req, res) => {
    res.render('success');
});

// Charge Route
app.post('/charge', (req, res) => {
    const amount = 2500;
    // console.log(req.body);
    // res.send('Test');
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
        amount,
        description: 'Web Development Ebook',
        currency: 'usd',
        customer: customer.id
    }))
    .then(charge => res.render('success'));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

