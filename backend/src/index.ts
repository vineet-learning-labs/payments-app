import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import mainRouter from '#routes/index.js';
import { connectDB } from '#db/index.js';


const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(bodyParser.json());

app.use('/api/v1', mainRouter);

const PORT = process.env.PORT;

const startServer = async() => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`DB connected, backend listening on PORT: ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();