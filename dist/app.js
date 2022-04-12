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
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const model_1 = require("./model");
const routes_1 = __importDefault(require("./routes"));
const swagger_1 = __importDefault(require("./utils/swagger"));
const helmet_1 = __importDefault(require("helmet"));
exports.app = (0, express_1.default)();
exports.app.use((0, helmet_1.default)());
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use(routes_1.default);
// Logic goes here
exports.app.get("/", (req, res) => {
    res.json({ message: "Welcome to authentication application." });
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield model_1.sequelize
        .sync()
        .then(() => {
        const port = process.env.PORT || "30000";
        exports.app.listen(port, () => {
            console.log(`Server running on port ${port}`);
            (0, swagger_1.default)(exports.app, Number.parseInt(port));
        });
    })
        .catch((err) => {
        console.log("Not able to connect to database");
        console.log(err);
    });
}))();
