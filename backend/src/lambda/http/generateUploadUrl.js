import {createLogger} from "../../utils/logger.mjs";
import {deleteTodo, generateUploadUrl} from "../../businessLogic/todos.mjs";
import {corsEnabled} from "../utils.mjs";

const logger = createLogger('Generate image url lambda')


export const handler = corsEnabled()
    .handler(async (event) => {
        logger.info('Processing event: ', event)
        const newItem = await generateUploadUrl(event)

        return {
            statusCode: 201, body: JSON.stringify({
                uploadUrl: newItem
            })
        }
    })
