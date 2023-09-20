import {DynamoDB} from '@aws-sdk/client-dynamodb'
import {DynamoDBDocument} from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import {createLogger} from "../utils/logger.mjs";
import {getS3Url, getSignedUrlOfTodo} from "../fileStorage/attachmentUtils.mjs";

export class TodosAccess {
    constructor(dynamoDb = AWSXRay.captureAWSv3Client(new DynamoDB()), todoTable = process.env.TODOS_TABLE, todoIdIndex = process.env.INDEX_NAME) {
        this.documentClinet = dynamoDb;
        this.todoTable = todoTable;
        this.todoIdIndex = todoIdIndex;
        this.dynamoDbClient = DynamoDBDocument.from(this.documentClinet);
        this.logger = createLogger("Todo access");
    }

    async getTodos(userId) {
        this.logger.info(`Loading todos for user ${userId}`)
        const param = {
            TableName: this.todoTable,
            IndexName: this.todoIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }
        return await this.dynamoDbClient.query(param)
    }

    async createTodo(todoItem) {
        const param = {
            TableName: this.todoTable, Item: todoItem,
        }
        await this.dynamoDbClient.put(param)
        return todoItem
    }

    async deleteTodo(userId, todoId) {
        const param = {
            TableName: this.todoTable, Key: {
                "userId": userId, "todoId": todoId
            }
        }

        await this.dynamoDbClient.delete(param)

        return `Todo ${todoId} is successfully deleted`
    }

    async updateTodo(todoItem) {

        const param = {
            TableName: this.todoTable,
            Key: {
                "userId": todoItem.userId, "todoId": todoItem.todoId
            },
            UpdateExpression: "set #tn = :n, dueDate=:dd, done=:d",
            ExpressionAttributeNames: {'#tn': 'name'},
            ExpressionAttributeValues: {
                ":n": todoItem.name, ":dd": todoItem.dueDate, ":d": todoItem.done
            }
        }

        await this.dynamoDbClient.update(param)

        return `Todo item ${todoItem.todoId} is updated`
    }


    async generateUploadUrl(userId, todoId) {
        this.logger.info(`Updating url for ${userId} with task ${todoId}`)
        const signedUrl = await getSignedUrlOfTodo(todoId);
        this.logger.info(`Signed url ${signedUrl}`)

        const param = {
            TableName: this.todoTable, Key: {
                "userId": userId, "todoId": todoId
            }, UpdateExpression: "set attachmentUrl = :a", ExpressionAttributeValues: {
                ":a": getS3Url(todoId)
            }
        }
        this.logger.debug(`param of attachment update ${param}`)
        await this.dynamoDbClient.update(param)

        return signedUrl
    }
}

