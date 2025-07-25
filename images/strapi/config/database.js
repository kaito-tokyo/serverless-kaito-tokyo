module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      connectionString: env('DATABASE_URL'),
      ssl: {
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: 0,
    },
    debug: false,
  },
});
