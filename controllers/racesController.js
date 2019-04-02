exports.get = function(req, res, next) {
    // roles.findAll().then(roles => {
    //   res.send(roles)
    // })
    res.render('index', { title: 'Express' });
  }