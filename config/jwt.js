const config = require('./settings');

module.exports.jwtConf = {
  secret: config.secret,
  issuedAt: () => (Math.round(new Date().getTime() / 1000)),
  expiresIn: iat => (iat + (60 * 60 * 24)),
  audience: 'https://localhost:3000',
  issuer: 'admin@danpurdy.co.uk',
};
