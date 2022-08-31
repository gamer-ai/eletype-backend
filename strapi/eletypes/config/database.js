const path = require('path');

module.exports = ({env}) => ({
  connection : {
    client : env('DATABASE_CLIENT', 'postgres'),

    connection : {
      host : env('DATABASE_HOST', '127.0.0.1'),
      port : env.int('DATABASE_PORT', 3306),
      database : env('DATABASE_NAME', 'eletypes'),
      user : env('DATABASE_USERNAME', 'eletypes'),
      password : env('DATABASE_PASSWORD', 'eletypespassword'),
    },
    debug : false,
  },
});
