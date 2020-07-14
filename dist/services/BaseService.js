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
const typeorm_1 = require("typeorm");
const User_1 = __importDefault(require("../entity/User"));
class BaseService {
    constructor(model) {
        this.insert = this.insert.bind(this);
        this.model = model;
    }
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const repository = typeorm_1.getRepository(this.model);
            try {
                const item = repository.create(data);
                const savedItem = yield repository.save(item);
                if (savedItem) {
                    return {
                        error: false,
                        savedItem,
                    };
                }
            }
            catch (error) {
                console.log("error", error);
                return {
                    error: true,
                    statusCode: 500,
                    message: error.errmsg || "Not able to create item",
                    errors: error.errors,
                };
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const repository = typeorm_1.getRepository(User_1.default);
            try {
                const singleItem = yield repository.findOne(id);
                if (singleItem) {
                    return {
                        error: false,
                        singleItem,
                    };
                }
            }
            catch (error) {
                return {
                    error: true,
                    statusCode: 400,
                    message: error.errmsg || "Item Not Found",
                    errors: error.errors,
                };
            }
        });
    }
    getAll(query) {
        throw new Error("Method not implemented.");
    }
    update(id, data) {
        throw new Error("Method not implemented.");
    }
    remove(id) {
        throw new Error("Method not implemented.");
    }
}
exports.default = BaseService;
//# sourceMappingURL=BaseService.js.map