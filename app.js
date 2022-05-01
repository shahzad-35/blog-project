const path = require('path');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const mongoConnect = require('./util/database').mongoConnect;

const errorController = require('./controllers/error');
const User = require('./models/user');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById("626ef52dbf0afd183387221e")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


mongoose
  .connect(
    process.env.MONGO_URL
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: "Shahzad",
          email: "shahzad@gmail.com",
          cart: {
            items: []
          }
        });
        user.save();
      }
    })

    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });