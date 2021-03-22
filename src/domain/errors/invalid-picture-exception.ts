export class InvalidPictureException extends Error {
    constructor() { super("Please provide PNG/JPG pictures") };
}