import dynamo from './dynamo';
import { v4 as uuidv4 } from 'uuid';

export interface IUser {
  id: string;
  name: string;
  email?: string,
  createdAt: string,
}

const response = (data: any, statusCode = 200, message?: string) => {
  const responseObject = {
    success: statusCode < 300,
    message,
    data
  }
  return (
    {
      statusCode,
      body: JSON.stringify(responseObject),
    }
  )
}

export const userService = {
  create: async (body) => {

    if (!body.email || !body.name) {
      return response(null, 400, 'missing email or name');
    }
    const newUser: IUser = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...body,
    }
    try {
      const data = await dynamo.create(newUser);
      return response(data, 201);
    } catch (error) {
      response(error.toString(), 500)
    }

  },

  getAll: async () => {
    try {
      const users = await dynamo.scan();
      return response(users);
    } catch (error) {
      response(error.toString(), 500)
    }

  },

  getOne: async (id: string) => {
    try {
      if (!id) {
        return response(null, 400, 'missing user id');
      }
      const user = await dynamo.get(id);
      if (!user) {
        return response(null, 404, 'user not found');
      }
      return response(user);
    } catch (error) {
      response(error.toString(), 500);
    }

  },

  deleteOne: async (id: string) => {
    if (!id) {
      return response(null, 400, 'missing user id');
    }

    try {
      const data = await dynamo.delete(id);
      return response(data)
    } catch (error) {
      response(error.toString(), 500);
    }
  }
}