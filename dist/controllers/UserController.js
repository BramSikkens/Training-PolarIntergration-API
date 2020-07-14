"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseController_1 = __importDefault(require("./BaseController"));
const User_1 = __importDefault(require("../entity/User"));
const express_1 = __importDefault(require("express"));
const UserService_1 = __importDefault(require("../services/UserService"));
class UserController extends BaseController_1.default {
    constructor(service) {
        super(service);
        this.path = "/users";
        this.router = express_1.default.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(this.path, this.insert);
    }
}
exports.default = new UserController(new UserService_1.default(User_1.default));
//# sourceMappingURL=UserController.js.map