import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createLogger } from "../utils/logger";
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";

const XAWS = AWSXRay.captureAWS(AWS);

const logger = createLogger("TodosAccess");

// TODO: Implement the dataLayer logic

export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE
  ) {}

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
        // ScanIndexForward: false
      })
      .promise();

    const items = result.Items;
    return items as TodoItem[];
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todo,
      })
      .promise();

    return todo;
  }

  async updateTodo(
    userId: string,
    todoId: string,
    todo: Partial<Pick<TodoItem, "name" | "dueDate" | "done">>
  ) {
    const params = {
      TableName: this.todosTable,
      Key: {
        userId,
        todoId,
      },
      UpdateExpression: "set #name = :name, dueDate = :dueDate, done = :done",
      ExpressionAttributeNames: {
        "#name": "name",
      },
      ExpressionAttributeValues: {
        ":name": todo.name,
        ":dueDate": todo.dueDate,
        ":done": todo.done,
      },
    };

    await this.docClient.update(params).promise();

    return todo;
  }


  async updateAttachment(
    todoId: string,
    userId: string,
    url: string,
  ) {
    const params = {
      TableName: this.todosTable,
      Key: {
        userId,
        todoId,
      },
      UpdateExpression: "set attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues: {
        ":attachmentUrl": url,
      },
    };

    await this.docClient.update(params).promise();
  }

  async deleteTodo(todoId: string, userId: string) {
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId,
      },
    }).promise();
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log("Creating a local DynamoDB instance");
    return new XAWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000",
    });
  }

  return new XAWS.DynamoDB.DocumentClient();
}
