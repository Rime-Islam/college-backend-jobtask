"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationHelper = void 0;
const calculatePagination = (options) => {
    const page = Number(options.page || 1);
    const limit = Number(options.limit || 10);
    const skip = (page - 1) * limit;
    // Queries
    const sort_by = options.sort_by || 'createdAt';
    const sort_order = options.sort_order || 'desc';
    return {
        page,
        limit,
        skip,
        sort_by,
        sort_order,
    };
};
exports.paginationHelper = {
    calculatePagination,
};
