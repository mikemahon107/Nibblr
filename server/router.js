var express = require('express');
var session = require('express-session');
var requests = require('./utils/requests.js');
var controller = require('./controllers/index.js');

var router = express.Router();

//Middleware function to check login status
router.use('/submit', function(req, res, next){
  if(req.session.loggedIn) {
    next();
  } else {
    res.send('please log in');
  }
});

router.use('/rsvp', function(req, res, next){
  if(req.session.loggedIn) {
    next();
  } else {
    console.log('redirect from rsvp')
    res.redirect('/list');
  }
});

//API Requests

router.route('/searchRestaurants')
  .get(function(req, res) {
    //make API call
    requests.nearbySearch(req, res);
  })

router.route('/getImage')
  .get(function(req, res) {
    //make API call
    requests.placePhotos(req, res);
  })


// DB Queries


router.route('/list')
  //gets all event details
  .get(function(req, res) {
    // insert helper function(s) for event details get requests
    controller.events.get(req, res);
  });


router.route('/submit')
  .post(function(req, res) {
    // add event to database
    controller.events.post(req, res);
  })

  router.route('/rsvp')
    .get(function(req, res) {
      controller.rsvp.getByEvent(req, res);
    })
    .post(function(req, res) {
      controller.rsvp.post(req, res);
    })
    .delete(function(req, res) {
      controller.rsvp.delete(req, res);
    })

// Authentication

router.route('/signup')
  .get(function(req, res) {
    // render signup page
    res.send('signup test - get')
  })
  .post(function(req, res) {
    controller.users.post(req, res, function(err, signup) {
      console.log('req.body', req.body);
      if (!err) {
        controller.users.get(req, res, function(err, userData) {
          if (err) {
            res.sendStatus(404);
          } else {
            req.session.user_id = userData[0].id;
            req.session.user = userData[0].username;
            req.session.loggedIn = true;
            console.log('session', req.session)
            console.log('signup success')
            res.send('signed up!') //`signed up with user ${req.session.user_id}`
          }
        })
      } else {
        res.sendStatus(404);
      }
    })
  })

router.route('/login')
  .get(function(req, res) {
    // render login page
    res.send('login test - get')
  })
  .post(function(req, res) {
    controller.login.get(req, res, function(userData) {
      if (userData) {
        console.log('userData', userData)
        // req.session.regenerate(function() {
          req.session.user_id = userData[0].id;
          req.session.user = userData[0].username;
          req.session.loggedIn = true;
          req.session.save()
          console.log('session', req.session)
          console.log('login success')
          // res.send(`user_id ${req.session.user_id}`);
        // });
      } else {
        console.log('no userData')
        res.send('Password does not match username - please try again')
      }
    });
  })

router.route('/logout')
  .get(function(req, res) {
    req.session.destroy();
    console.log('logged out', req.session) //session should be undefined
    res.send('logged out')
  })


router.route('/sessionuser')
  .get(function(req, res) {
    if (req.session) {
      res.json(req.session.user_id)
    } else {
      res.sendStatus(530)
    }
  })



module.exports = router;
