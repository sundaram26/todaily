import express from 'express';
import { connectDB } from './db';
import sysConfigRoute from './modules/system-config/system-config.route';

const app = express();

app.use("/api/v1/config", sysConfigRoute);

app.listen(3000, async () => {
    await connectDB();
    console.log(`app is running: http://localhost:${3000}`)
})