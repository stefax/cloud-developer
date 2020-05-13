export const config = {
  'version': 'v0',
  'database': {
    'username': process.env.POSTGRES_USERNAME,
    'password': process.env.POSTGRES_PASSWORD,
    'database': process.env.POSTGRES_DATABASE,
    'host': process.env.POSTGRES_HOST,
    'dialect': 'postgres',
  },
  'jwt': {
    'secret': process.env.JWT_SECRET
  },
  'server': {
    'host': "localhost",
    'port': process.env.PORT,
    'default_port': 8080
  }
};
