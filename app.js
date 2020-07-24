const express = require('express'),
         keys = require('./config/keys'),
       stripe = require('stripe')(keys.stripeSecretKey),
   bodyParser = require('body-parser'),
       exphbs = require('express-handlebars'),
       paypal = require('paypal-rest-sdk');

const userCredential = require('./config/userCredential');
paypal.configure({
    mode: userCredential.mode, // Sandbox or live
    client_id: userCredential.client_id,
    client_secret: userCredential.client_secret
});


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

// Buy with Paypal
app.post('/pay', (req, res) => {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:5000/success",
            "cancel_url": "http://localhost:5000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "T-shirt la TeamSK",
                    "sku": "001",
                    "price": "45.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "45.00"
            },
            "description": "T-shirt for the best team ever."
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            // console.log("Create Payment Response");
            // console.log(payment);
            for (let i=0; i<payment.links.length; ++i) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });
    
});

app.get('/success', (req, res) => {
    const payerId = req.query.PayerID,
        paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "45.00"
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            //console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            //res.send('Success');
        }
    });
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

