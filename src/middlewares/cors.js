import cors from 'cors';

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
    methods: 'GET,HEAD',
    preflightContinue: false,
    allowedHeaders: 'Content-Type, Authorization, Content-Length, X-Requested-With',
};

export default cors(corsOptions);