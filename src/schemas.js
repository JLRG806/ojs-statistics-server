import JoiBase from 'joi'
import JoiDate from '@joi/date'
import { startOfTomorrow, startOfToday } from "date-fns"

const Joi = JoiBase.extend(JoiDate)

const todayDate = new Date().toISOString().split('T')[0]

const timelineIntervalSchema = Joi.object({
    timelineInterval: Joi.string().valid('month', 'day').required()
})

const statsIssuesTimelineSchemaByMonth = Joi.object({
    dateStart: Joi.date().format('YYYY-MM-DD').max(todayDate).required(),
    dateEnd: Joi.date().format('YYYY-MM-DD').max(todayDate).required(),
    type: Joi.string().valid('files')
})

const statsIssuesTimelineSchemaByDay = Joi.object({
    dateStart: Joi.date().format('YYYY-MM-DD').less(Joi.ref('dateEnd')).required(),
    dateEnd: Joi.date().format('YYYY-MM-DD').max(todayDate).required(),
    type: Joi.string().valid('files')
})

const statsIssuesTimelineSchemaByYear = Joi.object({
    dateStart: Joi.date().format('YYYY').less(Joi.ref('dateEnd')).required(),
    dateEnd: Joi.date().format('YYYY').max(todayDate).required(),
    type: Joi.string().valid('files')
})

export const timelineIntervalSchemaHandler = (timelineInterval) => {
    const { error } = timelineIntervalSchema.validate({ timelineInterval })

    if (error) {
        return { error: error.details[0].message }
    }
    return false
}

export const statsIssuesTimelineSchemaHandler = (dateStart, dateEnd, timelineInterval, type) => {

    if (timelineInterval == 'month') {

        const { error } = statsIssuesTimelineSchemaByMonth.validate({ dateStart, dateEnd, type })
        if (error) {
            return { error: error.details[0].message }
        }
        return false
    }

    if (timelineInterval == 'day') {

        const { error } = statsIssuesTimelineSchemaByDay.validate({ dateStart, dateEnd, type })
        if (error) {
            return { error: error.details[0].message }
        }
        return false
    }

    if (timelineInterval == 'year') {

        const { error } = statsIssuesTimelineSchemaByYear.validate({ dateStart, dateEnd, type })
        if (error) {
            return { error: error.details[0].message }
        }
        return false
    }

    return { error: "Internal Error" }
}