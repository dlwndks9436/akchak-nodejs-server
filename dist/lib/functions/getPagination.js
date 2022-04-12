"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
const getPagination = (page, size) => {
    const limit = size ? +parseInt(size, 10) : 10;
    const offset = page ? parseInt(page, 10) * limit : 0;
    return { limit, offset };
};
exports.getPagination = getPagination;
