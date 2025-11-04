"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const farmerRoutes_1 = __importDefault(require("./routes/farmerRoutes"));
const fieldRoutes_1 = __importDefault(require("./routes/fieldRoutes"));
const harvestRoutes_1 = __importDefault(require("./routes/harvestRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, db_1.connectToDatabase)()
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    console.log('Please ensure MongoDB is installed and running on your system.');
    console.log('Visit https://docs.mongodb.com/manual/installation/ for installation instructions.');
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/farmers', farmerRoutes_1.default);
app.use('/api/fields', fieldRoutes_1.default);
app.use('/api/harvests', harvestRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.use('/api/reports', reportRoutes_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`MongoDB connection status: Check console logs above`);
});
exports.default = app;
//# sourceMappingURL=server.js.map