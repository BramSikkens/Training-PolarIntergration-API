module.exports = {
  name: "default",
  type: "mysql",
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_DATABASEUSERNAME,
  password: "",
  database: process.env.DATABASE_DATABASENAME,
  synchronize: true,
  logging: false,
  entities: ["dist/entity/**/*.js"],
};
