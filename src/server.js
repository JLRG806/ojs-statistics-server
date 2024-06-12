import config from './config/config.js'
import express from 'express'
import morgan from 'morgan'
import https from 'https'
import { Agent, setGlobalDispatcher } from 'undici'
import { timelineIntervalSchemaHandler, statsIssuesTimelineSchemaHandler } from './schemas.js'
import { URLSearchParams } from 'url'

const server = express()

server.use(morgan('dev'))

server.get('/stats/issues/timeline', async (req, res) => {

    const { dateStart, dateEnd, timelineInterval, context, type } = req.query

    const isTimelineIntervalInvalid = timelineIntervalSchemaHandler(timelineInterval)

    if (isTimelineIntervalInvalid) {
        return res.status(400).json({ error: isTimelineIntervalInvalid.error });
    }

    const isStatsIssuesTimelineSchemaInvalid = statsIssuesTimelineSchemaHandler(dateStart, dateEnd, timelineInterval, context, type)
    if (isStatsIssuesTimelineSchemaInvalid) {
        return res.status(400).json({ error: isStatsIssuesTimelineSchemaInvalid.error });
    }

    const agent = new Agent({
        connect: {
            rejectUnauthorized: false
        }
    })

    setGlobalDispatcher(agent)

    try {
        const response = await fetch(config.ojs.OJS_DOMAIN + '/index.php/' + context + '/api/v1/stats/issues/timeline?' + new URLSearchParams({
            dateStart: dateStart,
            dateEnd: dateEnd,
            timelineInterval: timelineInterval,
            type: type
        }), {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + config.ojs.API_KEY,
                'Content-Type': 'application/json',
                //'User-Agent': 'PostmanRuntime/7.37.3',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br'
            }
        })

        console.log(response)
        const statusCode = response.status
        if (statusCode >= 400 && statusCode <= 499) {
            return res.sendStatus(statusCode)
        }

        if (statusCode >= 500 && statusCode <= 599) {
            return res.sendStatus(statusCode)
        }
        return res.json(await response.json())
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error })
    }
})

// Server
server.listen(config.port, () => { console.log('Server started on port ' + config.port) })