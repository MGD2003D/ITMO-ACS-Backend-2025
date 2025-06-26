import express, { Request, Response, NextFunction } from 'express';
import proxy from 'express-http-proxy';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const services = {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    recipes: process.env.RECIPES_SERVICE_URL || 'http://localhost:3002',
    interactions: process.env.INTERACTIONS_SERVICE_URL || 'http://localhost:3003',
};

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[API Gateway] Incoming request: ${req.method} ${req.originalUrl}`);
    next();
});

const authenticateAndInjectUser = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key') as { userId: number };
            req.headers['x-user-id'] = decoded.userId.toString();
        } catch (err) {
        }
    }
    next();
};

app.use(express.json());
app.use(authenticateAndInjectUser);

console.log('Setting up API Gateway proxies...');

const proxyOptions = {
    proxyReqPathResolver: (req: Request) => req.originalUrl
};

app.use('/users', proxy(services.auth, proxyOptions));
app.use('/follows', proxy(services.auth, proxyOptions));
app.use('/recipes', proxy(services.recipes, proxyOptions));
app.use('/ingredients', proxy(services.recipes, proxyOptions));
app.use('/comments', proxy(services.interactions, proxyOptions));
app.use('/likes', proxy(services.interactions, proxyOptions));
app.use('/favorites', proxy(services.interactions, proxyOptions));

app.use('/auth-api-docs', proxy(services.auth, {
    proxyReqPathResolver: (req: Request) => `/api-docs${req.url}`
}));
app.use('/recipes-api-docs', proxy(services.recipes, {
    proxyReqPathResolver: (req: Request) => `/api-docs${req.url}`
}));
app.use('/interactions-api-docs', proxy(services.interactions, {
    proxyReqPathResolver: (req: Request) => `/api-docs${req.url}`
}));

app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
});