import {
    TodosAccess
} from "../dataLayer/todosAccess.mjs"
import {getUserId} from "../lambda/utils.mjs";
import {createLogger} from "../utils/logger.mjs";
import * as uuid from "uuid";

const todoAccess = new TodosAccess();
const logger = createLogger('Todos Business')

export async function getAllTodos(event) {
    return todoAccess.getTodos(getUserId(event))

}

export async function createTodoItem(event) {
    logger.info('createTodo', {event})

    const requestBody = JSON.parse(event.body)


    const todoItemTDO = {
        userId: getUserId(event),
        todoId: uuid.v4(),
        createdAt: new Date().toDateString(),
        name: requestBody.name,
        dueDate: requestBody.dueDate,
        done: false,
        attachmentUrl: '',
    }

    return todoAccess.createTodo(todoItemTDO);

}

export async function deleteTodo(event) {

    logger.info('deleteTodo', {event})

    return todoAccess.deleteTodo(getUserId(event), event.pathParameters.todoId)

}

export async function updateTodoItem(event) {

    logger.info('updateTodo', {event})

    const todo = JSON.parse(event.body)

    const todoItemTDO = {
        userId: getUserId(event),
        todoId: event.pathParameters.todoId,
        name: todo.name,
        dueDate: todo.dueDate,
        done: todo.done
    }

    return todoAccess.updateTodo(todoItemTDO)

}


export async function generateUploadUrl(event) {

    logger.info('generateUploadUrl', {event})

    return todoAccess.generateUploadUrl(getUserId(event), event.pathParameters.todoId)

}

