const passport = require('../Controller/jwtController');

const requireJWTAuth = passport.authenticate(
    "jwt", 
    { 
      session: false 
    }
);

module.exports = requireJWTAuth;