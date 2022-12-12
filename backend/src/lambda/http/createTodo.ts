import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";
import "source-map-support/register";
// import * as middy from "middy";
// import { cors } from "middy/middlewares";
import { CreateTodoRequest } from "../../requests/CreateTodoRequest";
import { getUserId } from "../utils";
import { createToDo } from "../../businessLogic/todos";

// export const handler = middy(
//   async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     const newTodo: CreateTodoRequest = JSON.parse(event.body)
//     // TODO: Implement creating a new TODO item

//     return undefined
// )

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // TODO: Implement creating a new TODO item
  const userId = getUserId(event);
  const newTodo: CreateTodoRequest = JSON.parse(event.body);
  const toDoItem = await createToDo(newTodo, userId);

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      item: toDoItem,
    }),
  };
};

// handler.use(
//   cors({
//     credentials: true,
//   })
// );
