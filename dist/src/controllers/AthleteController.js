"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseController_1 = __importDefault(require("./BaseController"));
const AthleteService_1 = __importDefault(require("../services/AthleteService"));
const Athlete_1 = __importDefault(require("../entity/Athlete"));
const express_1 = __importDefault(require("express"));
class AthleteController extends BaseController_1.default {
    constructor(service) {
        super(service);
        this.path = "/athletes";
        this.router = express_1.default.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(this.path, this.service.test);
    }
}
exports.default = new AthleteController(new AthleteService_1.default(Athlete_1.default));
//# sourceMappingURL=AthleteController.js.map