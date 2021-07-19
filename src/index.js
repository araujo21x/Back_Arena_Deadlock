import server from './server.js';
import dotenv from 'dotenv';
dotenv.config();

server.listen(process.env.PORT, () => { console.log(`listening on :${process.env.PORT}`)});