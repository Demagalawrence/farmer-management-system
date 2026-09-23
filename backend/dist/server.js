"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = __importDefault(require("./utils/logger"));
const backup_1 = require("./utils/backup");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const farmerRoutes_1 = __importDefault(require("./routes/farmerRoutes"));
const fieldRoutes_1 = __importDefault(require("./routes/fieldRoutes"));
const harvestRoutes_1 = __importDefault(require("./routes/harvestRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
const financeRoutes_1 = __importDefault(require("./routes/financeRoutes"));
const accessCodeRoutes_1 = __importDefault(require("./routes/accessCodeRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
app.use((req, res, next) => {
    logger_1.default.http(`${req.method} ${req.url}`);
    next();
});
(0, db_1.connectToDatabase)()
    .then(() => {
    logger_1.default.info('Connected to MongoDB');
    if (process.env.ENABLE_AUTO_BACKUP === 'true') {
        backup_1.backupService.scheduleAutoBackup('0 2 * * *');
        logger_1.default.info('Automatic backups scheduled');
    }
})
    .catch((error) => {
    logger_1.default.error('Failed to connect to MongoDB:', error);
    logger_1.default.warn('Please ensure MongoDB is installed and running on your system.');
    logger_1.default.warn('Visit https://docs.mongodb.com/manual/installation/ for installation instructions.');
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/farmers', farmerRoutes_1.default);
app.use('/api/fields', fieldRoutes_1.default);
app.use('/api/harvests', harvestRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.use('/api/reports', reportRoutes_1.default);
app.use('/api/search', searchRoutes_1.default);
app.use('/api/finance', financeRoutes_1.default);
app.use('/api/access-codes', accessCodeRoutes_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    logger_1.default.info(`Server is running on port ${PORT}`);
    logger_1.default.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger_1.default.info('MongoDB connection status: Check console logs above');
});
exports.default = app;
//# sourceMappingURL=server.js.map