var db = require('../db');

module.exports = {

  events: {
    get: function (params, callback) {
      // get all events
      var queryStr = 'select e.*, e.username creator, group_concat(u.id) rsvps \
                      from (select e.*, u.username from events e \
                      inner join users u on e.creatorID = u.id) e \
                      inner join rsvp r on e.id = r.event_id \
                      inner join users u \
                      on r.user_id = u.id \
                      group by e.id, e.name, e.event_time, e.location, e.description, e.creatorID, e.address, e.category, e.username';

      // if given a specific event_id, example: params = [1]
      if (params.length) {
        queryStr = queryStr.concat(' where e.id = ?');
        db.query(queryStr, params, function(err, data) {
          callback(err, results);
        });
      } else {
        db.query(queryStr, function(err, data) {
          callback(err, results);
        });
      }
    },
    post: function (params, callback) {
      // create a new event
      var queryStr = 'insert into events (name, event_time, location, description, creatorID, address, category) \
                      value (?, ?, ?, ?, ?, ?, ?)';
      db.query(queryStr, params, function(err, results) {
        callback(err, results);
      });
    }
  },
  users: {
    get: function (params, callback) {
      // fetch all users
      var queryStr = 'select * from users';
      if (params.length) {
        queryStr = queryStr.concat(' where id = ?');
        db.query(queryStr, params, function(err, results) {
          callback(err, results);
        })
      } else {
        db.query(queryStr, function(err, results) {
          callback(err, results);
        });
      }
    },
    post: function (params, callback) {
      // create a user
      var queryStr = 'insert into users (username, password) values (?, ?)';
      db.query(queryStr, params, function(err, results) {
        callback(err, results);
      });
    }
  },
  rsvp: {
    getByUser: function(params, callback) {
      // gets all events rsvped by a specific user
      var queryStr = 'select * from rsvp where user_id = ?'
      db.query(queryStr, params, function(err, results) {
        callback(err, results);
      })
    },
    getByEvent: function(params, callback) {
      // gets all users rsvped for a specific event
      var queryStr = 'select * from rsvp where event_id = ?'
      db.query(queryStr, params, function(err, results) {
        callback(err, results);
      })
    },
    post: function(params, callback) {
      // create a new rsvp
      var queryStr = 'insert into rsvp (user_id, event_id) values (?, ?)';
      db.query(queryStr, params, function(err, results) {
        callback(err, results);
      });
    },
    delete: function(params, callback) {
      var queryStr = 'delete from rsvp where event_id = ? and user_id = ?'
      db.query(queryStr, params, function(err, results) {
        callback(err, results);
      })
    }
  }
};



// tests:

// module.exports.users.post(['mike', 'abc'], function(err, results) {
//   console.log('users test post err: ', err)
//   console.log('users test post results: ', results)
// })
//
// module.exports.users.post(['nate', 'abc'], function(err, results) {
//   console.log('users test post err: ', err)
//   console.log('users test post results: ', results)
// })
//
// module.exports.users.post(['molly', 'abc'], function(err, results) {
//   console.log('users test post err: ', err)
//   console.log('users test post results: ', results)
// })
//
//
// // name, event_time, location, description, creatorID, address, category
// module.exports.events.post(['first event', '2017-07-04 12:30:00', 'Home Slice', 'This is the first event', 1, '800 Brazos St', 'pizza'], function(err, results) {
//   console.log('events test post err: ', err)
//   console.log('events test post results: ', results)
// })
//
// module.exports.events.post(['second event', '2017-07-04 12:30:00', 'Home Slice', 'This is the second event', 1, '800 Brazos St', 'pizza'], function(err, results) {
//   console.log('events test post err: ', err)
//   console.log('events test post results: ', results)
// })

// module.exports.events.get(function(err, results) {
//   console.log('events test get results: ', results)
//   for (var evnt of results) {
//     console.log('event.id: ', evnt.id);
//   }
// })
