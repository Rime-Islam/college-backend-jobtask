"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_router_1 = require("../app/modules/auth/auth.router");
const admission_route_1 = require("../app/modules/admission/admission.route");
const review_route_1 = require("../app/modules/review/review.route");
const college_route_1 = require("../app/modules/college/college.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_router_1.AuthRoutes,
    },
    {
        path: "/college",
        route: college_route_1.collegeRoutes,
    },
    {
        path: "/admission",
        route: admission_route_1.AdmissionRoutes,
    },
    {
        path: "/review",
        route: review_route_1.ReviewRoutes,
    },
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
