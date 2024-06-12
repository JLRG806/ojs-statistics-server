import config from './config/config.js';
import express from 'express';
import morgan from 'morgan';
import { Agent, setGlobalDispatcher } from 'undici';
import { timelineIntervalSchemaHandler, statsIssuesTimelineSchemaHandler } from './schemas.js';
import { URLSearchParams } from 'url';

const server = express();

// Configure middlewares
server.use(morgan('dev'));

// Configure Undici agent globally
const agent = new Agent({ connect: { rejectUnauthorized: false } });
setGlobalDispatcher(agent);

// Middleware for validating timeline interval
const validateTimelineInterval = (req, res, next) => {
    const { timelineInterval } = req.query;
    const isInvalid = timelineIntervalSchemaHandler(timelineInterval);
    if (isInvalid) {
        return res.status(400).json({ error: isInvalid.error });
    }
    next();
};

// Middleware for validating stats issues timeline schema
const validateStatsIssuesTimeline = (req, res, next) => {
    const { dateStart, dateEnd, timelineInterval, context, type } = req.query;
    const isInvalid = statsIssuesTimelineSchemaHandler(dateStart, dateEnd, timelineInterval, context, type);
    if (isInvalid) {
        return res.status(400).json({ error: isInvalid.error });
    }
    next();
};

// Route handler
server.get('/stats/issues/timeline', validateTimelineInterval, validateStatsIssuesTimeline, async (req, res) => {
    const { dateStart, dateEnd, timelineInterval, context, type } = req.query;

    try {
        const response = await fetch(
            `${config.ojs.OJS_DOMAIN}/index.php/${context}/api/v1/stats/issues/timeline?${new URLSearchParams({
                dateStart,
                dateEnd,
                timelineInterval,
                type,
            })}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${config.ojs.API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br',
                },
            }
        );

        const statusCode = response.status;
        if (statusCode >= 400 && statusCode < 500) {
            return res.sendStatus(statusCode);
        }

        if (statusCode >= 500 && statusCode < 600) {
            return res.sendStatus(statusCode);
        }

        const data = await response.json();
        return res.json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
});

// Start server
server.listen(config.port, () => {
    console.log(`Server started on port ${config.port}`);
});