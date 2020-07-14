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
// import express from "express";
// import dotenv from "dotenv";
const typeorm_1 = require("typeorm");
const app_1 = __importDefault(require("./app"));
const AthleteController_1 = __importDefault(require("./controllers/AthleteController"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield typeorm_1.createConnection();
    }
    catch (error) {
        console.log("Error while connecting to the database", error);
        return error;
    }
    const app = new app_1.default([AthleteController_1.default], 5000);
    app.listen();
}))();
//# sourceMappingURL=index.js.map