import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";
import { deleteToDo } from "../../businessLogic/todos";
import { getUserId } from "../utils";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // TODO: Remove a TODO item by id
  const userId = getUserId(event);
  const todoId = event.pathParameters.todoId;
  const deleteData = await deleteToDo(todoId, userId);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ deleteData }),
  };
};
