"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const services = {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    recipes: process.env.RECIPES_SERVICE_URL || 'http://localhost:3002',
    interactions: process.env.INTERACTIONS_SERVICE_URL || 'http://localhost:3003',
};
app.use((req, res, next) => {
    console.log(`[API Gateway] Incoming request: ${req.method} ${req.originalUrl}`);
    next();
});
const authenticateAndInjectUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
            req.headers['x-user-id'] = decoded.userId.toString();
        }
        catch (err) {
        }
    }
    next();
};
app.use(express_1.default.json());
app.use(authenticateAndInjectUser);
console.log('Setting up API Gateway proxies...');
const proxyOptions = {
    proxyReqPathResolver: (req) => req.originalUrl
};
app.use('/users', (0, express_http_proxy_1.default)(services.auth, proxyOptions));
app.use('/follows', (0, express_http_proxy_1.default)(services.auth, proxyOptions));
app.use('/recipes', (0, express_http_proxy_1.default)(services.recipes, proxyOptions));
app.use('/ingredients', (0, express_http_proxy_1.default)(services.recipes, proxyOptions));
app.use('/comments', (0, express_http_proxy_1.default)(services.interactions, proxyOptions));
app.use('/likes', (0, express_http_proxy_1.default)(services.interactions, proxyOptions));
app.use('/favorites', (0, express_http_proxy_1.default)(services.interactions, proxyOptions));
app.use('/auth-api-docs', (0, express_http_proxy_1.default)(services.auth, {
    proxyReqPathResolver: (req) => `/api-docs${req.url}`
}));
app.use('/recipes-api-docs', (0, express_http_proxy_1.default)(services.recipes, {
    proxyReqPathResolver: (req) => `/api-docs${req.url}`
}));
app.use('/interactions-api-docs', (0, express_http_proxy_1.default)(services.interactions, {
    proxyReqPathResolver: (req) => `/api-docs${req.url}`
}));
app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
});
