import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { parseUserId } from '../auth/utils'
import { getAttachmentUrl, getIdsFromKey, getUploadUrl } from './attachmentUtils'

// TODO: Implement businessLogic

const todosAccess = new TodosAccess();

export async function getAllTodos(token: string): Promise<TodoItem[]> {
  const userId = parseUserId(token);
  return todosAccess.getAllTodos(userId);
}

export async function createTodo(todo: CreateTodoRequest, token: string): Promise<TodoItem> {
  const todoId = uuid.v4();
  const userId = parseUserId(token);

  return todosAccess.createTodo({
    todoId,
    userId,
    done: false,
    dueDate: todo.dueDate,
    name: todo.name,
    createdAt: new Date().toISOString(),
  })
}

export async function updateTodo(id: string, token: string, update: UpdateTodoRequest) {
  const userId = parseUserId(token);
  return todosAccess.updateTodo(userId, id, update);
}

export async function deleteTodo(todoId: string, token: string) {
  const userId = parseUserId(token);
  return todosAccess.deleteTodo(todoId, userId);
}

export async function updateTodoAttachment(id: string) {
  const [userId, todoId] = getIdsFromKey(id);

  return todosAccess.updateAttachment(todoId, decodeURI(userId), getAttachmentUrl(userId, todoId));
}

export function generateUrl(todoId: string, token: string) {
  const userId = parseUserId(token);
  const uploadUrl = getUploadUrl(userId, todoId);

  return uploadUrl;
}