import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from "aws-lambda";
import { createAttachmentPresignedUrl } from "../../businessLogic/todos";
import { getUserId } from "../utils";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  console.log("Processing Event ", event);
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);

  const URL = await createAttachmentPresignedUrl(todoId, userId);

  return {
    statusCode: 202,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      uploadUrl: URL,
    }),
  };
};
