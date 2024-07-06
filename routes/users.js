const express = require('express');
const User = require('../models/user');
const router = express.Router();
const passport = require('passport');
const authenticate = require('../authenticate');

/* GET users listing. */
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.find()
    .then(users => res.status(200).json(users))
    .catch(err => next(err))
    });

//New User Signup
router.post('/signup', (req, res) => {
    User.register(
        new User({username: req.body.username}),
        req.body.password,
        err => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
            } else {
                if (req.body.firstname) {
                    user.firstname = req.body.firstname;
                }
                if (req.body.lastname) {
                    user.lastname = req.body.lastname;
                }
                user.save(err => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({err: err});
                        return;
                    }
                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, status: 'Registration Successful!'});
                    });
                });
            }
        }
    );
});

//New User Signup
// router.post('/signup', async (req, res) => {
//     try {
//         const user = (new User({username: req.body.username}));
//         const registeredUser = await user.register(user, req.body.password);

//         if (req.body.firstname) {
//             registeredUser.firstname = req.body.firstname;
//         }
//         if (req.body.lastname) {
//             registeredUser.lastname = req.body.lastname;
//         }

//         await registeredUser.save();


//         req.login(registeredUser, function(err) {
//             if (err) {
//                 res.status(500).json({err});
//                 return;
//             }
//             passport.authenticate('local')(req, res, () => {
//                 res.status(200).json({success: true, status: "Registration Successful!"});
//             });
//         });
//         } catch (err) {
//         res.status(500).json({err});
//     }               
// });


//User Login
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    const token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

//User Logout
router.get('/logout', (req, res, next) => {
  if (req.session) {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
  } else {
      const err = new Error('You are not logged in!');
      err.status = 401;
      return next(err);
  }
});


module.exports = router;
