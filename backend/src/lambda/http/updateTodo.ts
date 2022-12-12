import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";
import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest";
import { updateToDo } from "../../businessLogic/todos";
import { getUserId } from "../utils";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const userId = getUserId(event);
  const todoId = event.pathParameters.todoId;
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);

  const toDoItem = await updateToDo(updatedTodo, todoId, userId);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      item: toDoItem,
    }),
  };
};
