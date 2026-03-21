import express from 'express';
import { connectDB } from './db';

const app = express();

app.get('/', (req, res) => {
    res.send("Hello world")
})


app.listen(3000, async () => {
    await connectDB();
    console.log(`app is running: http://localhost:${3000}`)
})