import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import socket from './game/socket.js';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["*"],
    credentials: true,
    methods: ["GET", "POST"]
  }
});

socket(io);
export default server;