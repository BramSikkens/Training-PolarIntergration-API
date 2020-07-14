"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        this.getAthleteById = this.getAthleteById.bind(this);
    }
    initializeRoutes() {
        this.router.post(this.path, this.insert);
        this.router.get(this.path + "/:userid", this.getAthleteById.bind(this));
    }
    getAthleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userid } = req.params;
            const response = yield this.service.getById(userid);
            if (response.error)
                return res.status(response.statusCode).send(response);
            return res.status(201).send(response);
        });
    }
}
exports.default = new AthleteController(new AthleteService_1.default(Athlete_1.default));
//# sourceMappingURL=AthleteController.js.map