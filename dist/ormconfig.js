"use strict";
// {
//   "name": "default",
//   "type": "mysql",
//   "host": "localhost",
//   "port": 3306,
//   "username": "root",
//   "password": "",
//   "database": "VKKFTraining",
//   "synchronize": true,
//   "logging": false,
//   "entities": [
//     "dist/entity/**/*.js"
//   ]
// }
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "VKKFTraining",
    entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    synchronize: true,
};
exports.default = config;
//# sourceMappingURL=ormconfig.js.map