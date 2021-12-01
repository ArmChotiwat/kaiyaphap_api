// const jwt = require("jwt-simple");
const passport = require("passport");
const { JWT_SECRET } = require('../Config/cfg_crypto');


//ใช้ในการ decode jwt ออกมา
const ExtractJwt = require("passport-jwt").ExtractJwt;


//ใช้ในการประกาศ Strategy
const JwtStrategy = require("passport-jwt").Strategy;
//สร้าง Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: JWT_SECRET
};
const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
    // const findLoginUsers = userModel.findOne({ username: payload.sub });
    // if (findLoginUsers) done(null, true);
    // else done(null, false);
    done(null, true)
});

//เสียบ Strategy เข้า Passport
passport.use(jwtAuth);

module.exports = passport;