import * as aws from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { IUser } from './user.service';

const db: DocumentClient = new aws.DynamoDB.DocumentClient({
  region: 'us-east-1',
});

const defaultParams = { TableName: 'usersTable' };

export default {
  create: async (newUser: IUser) => {
    const params = {
      ...defaultParams,
      Item: newUser,
    }
    await db.put(params).promise();
    return newUser;
  },

  get: async (key: string) => {
    const params = {
      ...defaultParams,
      Key: {
        id: key
      },
    }

    const { Item } = await db.get(params).promise();
    return Item;

  },

  scan: async () => {
    return await db.scan(defaultParams).promise();
  },

  update: async (updatedUser: Partial<IUser>) => {

  },

  delete: async (key) => {
    const params = {
      ...defaultParams, 
      Key: {
        id: key
      }
    }
    return await db.delete(params).promise();
  }

}

