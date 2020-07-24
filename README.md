# Node server with Ebook Stripe & Paypal :credit_card: 

Node.js, express app that uses the Stripe and Paypal API to sell an ebook.

:computer: I developed this app to practice online payment APIs.

## Version 
**1.0.0**

## Sreenshot
![dashboard](/public/img/db.png)
![stripe](/public/img/stripe1.png)

# Usage

## Create a config/keys_dev.js file and add 
### Stripe
```javascript
module.exports = {
  stripePublishableKey:'_YOUR_OWN_PUBLISHABLE_KEY_',
  stripeSecretKey:'_YOUR_OWN_SECRET_KEY_'
}
```

## Create a config/userCredential.js file and add 
### Paypal
```javascript
const userCredential = {
    mode: 'sandbox',
    client_id: '_YOUR_OWN_CLIENT_ID',
    client_secret: '_YOUR_OWN_CLIENT_SECRET'
}
module.exports = userCredential;
```

## Installation
Install the dependencies
```javascript
$ npm install 
```
## Serve
To serve in the browser
```javascript
$ npm start
```
## Author
Samuel KUETA [:link:](https://www.linkedin.com/in/samuel-kueta-930a92112)

## License
MIT
