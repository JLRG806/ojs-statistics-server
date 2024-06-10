import dotenv from 'dotenv';
dotenv.config();

export default {
    port: process.env.SERVER_PORT,
    ojs: {
        API_KEY: process.env.OJS_API_KEY,
        OJS_DOMAIN: process.env.OJS_DOMAIN_URL
    }
}