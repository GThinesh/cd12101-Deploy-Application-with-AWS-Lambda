import {createLogger} from "../../utils/logger.mjs";
import {getAllTodos} from "../../businessLogic/todos.mjs";
import {corsEnabled} from "../utils.mjs";

const logger = createLogger('Get todos lambda')


export const handler = corsEnabled()
    .handler(async (event) => {
        logger.info('Processing event: ', event)
        const todos = await getAllTodos(event)

        return {
            statusCode: 200, body: JSON.stringify({
                items: todos
            })
        }
    })
