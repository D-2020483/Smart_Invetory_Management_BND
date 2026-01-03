import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


connectDB();

const app = express();

app.use(cors({ origin: ["http://localhost:5173", "https://inventory-management-bnd-dinithi.netlify.app"] }));

app.use(express.json()); 


app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));