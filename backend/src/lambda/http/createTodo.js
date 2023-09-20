import {createLogger} from "../../utils/logger.mjs";
import {createTodoItem} from "../../businessLogic/todos.mjs";
import {corsEnabled} from "../utils.mjs";

const logger = createLogger('Create todo lambda')


export const handler = corsEnabled()
    .handler(async (event) => {
        logger.info('Processing event: ', event)
        const item = await createTodoItem(event)

        let todoJson = JSON.stringify({item});
        logger.info(`Created ${todoJson}`)
        return {
            statusCode: 201, body: todoJson
        }
    })
