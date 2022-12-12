import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createLogger } from "../utils/logger";
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";

const XAWS = AWSXRay.captureAWS(AWS);

const logger = createLogger("TodosAccess");

export class ToDoAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todoTable = process.env.TODOS_TABLE,
    private readonly createdAtIndex = process.env.TODOS_CREATED_AT_INDEX,
    private readonly s3BucketName = process.env.S3_BUCKET_NAME
  ) {}

  async getAllToDo(userId: string): Promise<TodoItem[]> {
    logger.info("Getting all todo");

    const params = {
      TableName: this.todoTable,
      IndexName: this.createdAtIndex,
      KeyConditionExpression: "#userId = :userId",
      ExpressionAttributeNames: {
        "#userId": "userId",
      },
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    };

    const result = await this.docClient.query(params).promise();
    logger.info(result);
    const items = result.Items;

    return items as TodoItem[];
  }

  async createToDo(todoItem: TodoItem): Promise<TodoItem> {
    logger.info("Creating new todo");

    const params = {
      TableName: this.todoTable,
      Item: todoItem,
    };

    const result = await this.docClient.put(params).promise();
    logger.info(result);

    return todoItem as TodoItem;
  }

  async updateToDo(
    todoUpdate: TodoUpdate,
    todoId: string,
    userId: string
  ): Promise<TodoUpdate> {
    logger.info("Updating todo");

    const params = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId,
      },
      UpdateExpression: "set #a = :a, #b = :b, #c = :c",
      ExpressionAttributeNames: {
        "#a": "name",
        "#b": "dueDate",
        "#c": "done",
      },
      ExpressionAttributeValues: {
        ":a": todoUpdate["name"],
        ":b": todoUpdate["dueDate"],
        ":c": todoUpdate["done"],
      },
      ReturnValues: "ALL_NEW",
    };

    const result = await this.docClient.update(params).promise();
    logger.info(result);
    const attributes = result.Attributes;

    return attributes as TodoUpdate;
  }

  async deleteToDo(todoId: string, userId: string): Promise<void> {
    logger.info("Deleting todo");

    const params = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId,
      },
    };

    const result = await this.docClient.delete(params).promise();
    logger.info(result);
  }

  async saveUploadUrl(todoId: string, userId: string): Promise<void> {
    logger.info("saving signed URL");
    const params = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId,
      },
      UpdateExpression: "set #a = :a",
      ExpressionAttributeNames: {
        "#a": "attachmentUrl",
      },
      ExpressionAttributeValues: {
        ":a": `https://${this.s3BucketName}.s3.amazonaws.com/${todoId}`,
      },
    };

    const result = await this.docClient.update(params).promise();
    logger.info(result);
  }
}
function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info("Creating a local DynamoDB instance");
    return new XAWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000",
    });
  }

  return new XAWS.DynamoDB.DocumentClient();
}
