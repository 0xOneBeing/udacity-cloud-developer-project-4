import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { TodoUpdate } from "../models/TodoUpdate";
import { ToDoAccess } from "../dataLayer/ToDoAccess";
import { AttachmentUtils } from "../dataLayer/attachmentUtils";

const uuidv4 = require("uuid/v4");
const toDoAccess = new ToDoAccess();
const attachmentUtils = new AttachmentUtils();

export async function getAllToDo(userId: string): Promise<TodoItem[]> {
  return await toDoAccess.getAllToDo(userId);
}

export function createToDo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const todoId = uuidv4();
  return toDoAccess.createToDo({
    userId: userId,
    todoId: todoId,
    createdAt: new Date().getTime().toString(),
    done: false,
    ...createTodoRequest,
  });
}

export async function updateToDo(
  updateTodoRequest: UpdateTodoRequest,
  todoId: string,
  userId: string
): Promise<TodoUpdate> {
  return await toDoAccess.updateToDo(updateTodoRequest, todoId, userId);
}

export async function deleteToDo(todoId: string, userId: string) {
  return await toDoAccess.deleteToDo(todoId, userId);
}

export async function createAttachmentPresignedUrl(
  todoId: string,
  userId: string
): Promise<string> {
  const signedUrl = attachmentUtils.getUploadUrl(todoId);
  await toDoAccess.saveUploadUrl(todoId, userId);

  return signedUrl;
}
