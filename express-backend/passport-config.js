const LocalStrategy = require("passport-local").Strategy;

const initialize = (passport, getUserByEmail, getUserById) => {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email);

    return done(null, user);
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user_id));
  passport.deserializeUser(async (id, done) => {
    return done(null, await getUserById(id))
  });
};

module.exports = initialize;
