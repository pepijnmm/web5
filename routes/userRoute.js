module.exports = function(app, passport) {
    // app.post('/login', passport.authenticate('local-login', {
    //     successRedirect : '/profile',
    //     failureRedirect : '/xd', 
    //     session: false
    // }),
    // function(req, res){
    //     res.json(res)
    // });

    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
          if (err) { return next(err); }
          if (!user) { return res.redirect('/login'); }

          res.json(info);
        })(req, res, next);
      });

    app.post('/signup', function(req, res, next) {
        passport.authenticate('local-signup', function(err, user, info) {
          if (err) { return res.json(err); }
          if (!user) { return res.json(info); }

          res.json(info);
        })(req, res, next);
      });

      app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

      // the callback after google has authenticated the user
      app.get('/auth/google/callback',
          passport.authenticate('google', {
              successRedirect : '/profile',
              failureRedirect : '/'
      }));
}