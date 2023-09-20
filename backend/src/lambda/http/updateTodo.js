import {createLogger} from "../../utils/logger.mjs";
import {updateTodoItem} from "../../businessLogic/todos.mjs";
import {corsEnabled} from "../utils.mjs";

const logger = createLogger('Update todo lambda')


export const handler = corsEnabled()
    .handler(async (event) => {
        logger.info('Processing event: ', event)
        const message = await updateTodoItem(event)

        return {
            statusCode: 200,
            body: JSON.stringify(message)
        }
    })
