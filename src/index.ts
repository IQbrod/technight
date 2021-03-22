import { InvalidPictureException } from "./domain/errors/invalid-picture-exception";
import { Dog } from "./domain/dog";
import { submitDog, getDog } from "./service/dynamo-service";
import { MissingFieldException } from "./domain/errors/missing-field-exception";

module.exports.submit = (event: any, context: any, cb: any) => {
    const requestBody = JSON.parse(event.body);

    try {
        const dog: Dog = Dog.fromRequest(requestBody);

        submitDog(dog, (err: any, id: string) => {
            if (err) { throw err; }
            dog.id = id;
            cb(null, {statusCode: 200, headers: {}, body: JSON.stringify(dog)});
        });
    } catch(error) {
        cb(null, {statusCode: (
            error instanceof InvalidPictureException ||
            error instanceof MissingFieldException
        ) ? 400 : 500, headers: {}, body: error.message});
    }
}

module.exports.get = (event: any, context: any, cb: any) => {
    try {
        const id: string = event.pathParameters.id;

        getDog(id, (err: any, rawDog: any) => {
            if (err) { throw err; }
            const dog: Dog = Dog.fromDynamo(rawDog.Item);
            cb(null, {statusCode: 200, headers: {}, body: JSON.stringify(dog)});
        });
    } catch(error) {
        cb(null, {statusCode: 500, headers: {}, body: error.message});
    }
}