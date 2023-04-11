import http from 'http';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Server } from 'socket.io';
import { Constants, NodeEnv, Logger } from '@utils';
import { router } from '@router';
import { ErrorHandling } from '@utils/errors';
import Socket from '@utils/socket';

//swagger
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { options } from '@utils/swagger';


const app = express();

// Set up request logger
if (Constants.NODE_ENV === NodeEnv.DEV) {
  app.use(morgan('tiny')); // Log requests only in development environments
}

// Set up request parsers
app.use(express.json()); // Parses application/json payloads request bodies
app.use(express.urlencoded({ extended: false })); // Parse application/x-www-form-urlencoded request bodies
app.use(cookieParser()); // Parse cookies

// Set up CORS
app.use(
  cors({
    origin: Constants.CORS_WHITELIST,
  })
);

const specs = swaggerJsDoc(options);

app.use('/api', router);
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(ErrorHandling);


const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: Constants.CORS_WHITELIST,
    methods: ["GET", "POST"],
  },
});

Socket(io);

server.listen(Constants.PORT, () => {
  Logger.info(`Server listening on port ${Constants.PORT}`);
});
