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

  update: async (id: string, data: any) => {
    let expression = '';
    let attributes = {};

    const keys = Object.keys(data);
    keys.forEach((key, i) => {
      expression += `${key} = :${key}${i + 1 < keys.length ? ',' : ''}`;
    });

    for (let [key, value] of Object.entries(data)) {
      attributes[`:${key}`] = value;
    };

    const params = {
      ...defaultParams,
      Key: { id },
      ConditionExpression: 'attribute_exists(id)',
      UpdateExpression: `SET ${expression}`,
      ExpressionAttributeValues: attributes,
      // UpdateExpression: 'SET email = :email, userName = :userName',
      // ExpressionAttributeValues: {
      //   ':email': data.email,
      //   ':userName': data.userName
      // },
      ReturnValues: 'ALL_NEW'
    }

    return await db.update(params).promise();
  },

  delete: async (key: string) => {
    const params = {
      ...defaultParams,
      Key: {
        id: key
      }
    }
    return await db.delete(params).promise();
  }

}

