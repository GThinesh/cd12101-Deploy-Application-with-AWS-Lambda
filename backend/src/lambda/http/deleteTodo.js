import {createLogger} from "../../utils/logger.mjs";
import {deleteTodo} from "../../businessLogic/todos.mjs";
import {corsEnabled} from "../utils.mjs";

const logger = createLogger('Delete todo lambda')


export const handler = corsEnabled()
    .handler(async (event) => {
        logger.info('Processing event: ', event)
        const message = await deleteTodo(event)

        return {
            statusCode: 204,
            body: JSON.stringify(message)
        }
    })
