import AWS from 'aws-sdk';
import { v1 as uuidv1 } from 'uuid';
import { Dog } from '../domain/dog';
import { PutItemInput } from 'aws-sdk/clients/dynamodb';

AWS.config.update({ region: 'eu-west-3' });

const dynamo = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const submitDog = (dog: Dog, cb: any) => {
    const id = uuidv1();

    const params: PutItemInput = {
        TableName: process.env.DOGS_TABLE,
        Item: dog.toDynamo(id)
    };

    dynamo.putItem(params, (err, data) => {
        cb(err, id);
    });
}

const getDog = (id: string, cb: any) => {
    const params = {
        TableName: process.env.DOGS_TABLE,
        Key: {
          id: { S: id },
        },
        // ProjectionExpression: "id, name, age", // Filter purpose
    };

    dynamo.getItem(params, (err, data) => {
        cb(err, data);
    });
}

export { submitDog, getDog };