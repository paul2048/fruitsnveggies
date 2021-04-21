const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const init = (passport, getUserBy) => {
  const authUser = async (email, password, done) => {
    try {
      const user = await getUserBy('email', email);
      if (!user) {
        return done(null, false);
      }

      const loginSuccess = await bcrypt.compare(password, user.hash);
      if (loginSuccess) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (e) {
      done(e);
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authUser));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserBy('id', id);
      const userInfo = {
        balance: user.balance,
        city: user.city,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        postcode: user.postcode,
        street: user.street,
      };
      done(null, userInfo);
    } catch (e) {
      console.error(e);
    }
  });
};

module.exports = init;