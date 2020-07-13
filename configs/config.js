/* global module, process */
module.exports = {
  HOST_PROTOCOL: process.env.HOST_PROTOCOL || 'http://',
  FRONTEND_HOST: process.env.FRONTEND_HOST || 'http://localhost:8000',
  POWERTOKENSENDLIMIT: process.env.POWERTOKENSENDLIMIT || 0.5,
  mongo: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017,localhost:27018,localhost:27019/timeswapper?replicaSet=rs1',
  },
  JWT: {
    secret: process.env.JWT_SEC || 'HelloBlcko',
    expire: 28800000 || 3600000,
  },
  CRYPTR: {
    password: process.env.cryptrPassword || 'privateKeyPassword@123',
  },
  SOCIAL: {
    GOOGLE: {
      CLIENT_ID: process.env.G_CLIENT_ID || '524726124380-u1nngf3k396jhtgrbmnqc6gchvsr6s3k.apps.googleusercontent.com',
      CLIENT_SECRET: process.env.G_CLIENT_SEC || 'kNUGAz_SQpBoZCTyOW7F3JHz',
      REDIRECT_URI: process.env.G_RED_URI || 'http://ec2-18-220-230-245.us-east-2.compute.amazonaws.com:3000/login',
    },
    FB: {
      CLIENT_ID: process.env.F_CLIENT_ID || '570289253420635',
      CLIENT_SECRET: process.env.F_CLIENT_SEC || '48222bcb575887cd46d1a1996a00be23',
      REDIRECT_URI: process.env.F_RED_URI || 'https://7d9a37c6.ngrok.io/login', //FB needs HTTPS only
    },
  },
  MAIL: {
    ccMail: process.env.CC_MAIL || 'info@eraswaptoken.io',
    fromMail: process.env.FROM_MAIL || 'info@eraswaptoken.io',
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    SMTP_PORT: process.env.SMTP_PORT || 465,
    SECURE: process.env.SECURE || true, //in case port value is 465
    SMTP_USER: process.env.SMTP_USER || 'startsetteam',
    SMTP_PASS: process.env.SMTP_PASS || 'saikat95',
    toMail: process.env.TO_MAIL || 'info@eraswaptoken.io',
    CC : process.env.CC || ['mrapelli141@gmail.com']
  },
};