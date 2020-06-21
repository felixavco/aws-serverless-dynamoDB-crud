import { userService } from './src/user.service';
import { APIGatewayProxyHandler } from 'aws-lambda';

export const createUser: APIGatewayProxyHandler = async ({ body }) => {
  return await userService.create(JSON.parse(body));
}

export const getUsers: APIGatewayProxyHandler = async () => {
  return await userService.getAll();
}

export const getUser: APIGatewayProxyHandler = async (request) => {
  const id = request.pathParameters.id;
  return await userService.getOne(id);
}

export const deleteUser: APIGatewayProxyHandler = async (request) => {
  const id = request.pathParameters.id;
  return await userService.deleteOne(id);
}
