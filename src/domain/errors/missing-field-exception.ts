export class MissingFieldException extends Error {
    constructor(field: string) { super("Missing field: " + field) };
}