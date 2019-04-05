module.exports = function(app, passport) {
    // app.post('/login', passport.authenticate('local-login', {
    //     successRedirect : '/profile',
    //     failureRedirect : '/xd', 
    //     session: false
    // }),
    // function(req, res){
    //     res.json(res)
    // });
    app.get('/login',function(req,res,next){res.render('user/login',{layout:false});});
    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
          if (err) { return next(err); }
          if (!user) { return res.redirect('/login'); }
          res.cookie('token', info);
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

      app.get('/auth/google/callback', function(req, res, next) {
        passport.authenticate('google', function(err, user, info) {
          if (err) { return next(err); }
          if (!user) { return res.redirect('/login'); }

          res.json(info);
        })(req, res, next);
      });
}
