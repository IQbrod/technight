module.exports.get = (event, context, cb) => {
    cb(null, {statusCode: 200, headers: {}, body: "Hello world"});
}