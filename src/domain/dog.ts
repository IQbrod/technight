import { PutItemInputAttributeMap } from "aws-sdk/clients/dynamodb";
import { InvalidPictureException } from "./errors/invalid-picture-exception";
import { MissingFieldException } from "./errors/missing-field-exception";

export class Dog {
    id: string;
    name: string;
    age: number;
    picture: string;

    static fromRequest(body: any): Dog | never {
        const dog: Dog = new Dog();

        dog.name = body.name;
        if (!dog.name) { throw new MissingFieldException("name"); }

        dog.age = body.age;
        if (!dog.age || dog.age < 0) { throw new MissingFieldException("age"); }

        const rawPicture: string = body?.picture;
        if (!rawPicture || rawPicture.endsWith(".png") || rawPicture.endsWith(".jpg")) {
            dog.picture = rawPicture;
        } else {
            throw new InvalidPictureException();
        }
        return dog;
    }

    static fromDynamo(rawDog: any): Dog {
        const dog: Dog = new Dog();

        dog.id = rawDog.id.S;
        dog.name = rawDog.name.S;
        dog.age = Number(rawDog.age.N);
        dog.picture = rawDog.picture.S;

        return dog;
    }

    toDynamo(id: string): PutItemInputAttributeMap {
        return {
            'id' : { S: id },
            'name' : { S: this.name },
            'age' : { N: this.age.toString() },
            'picture': { S: this.picture || "" },
            'last_modified': { S: new Date().getTime().toString() }
        }
    }
}