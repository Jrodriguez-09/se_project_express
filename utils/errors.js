const BAD_REQUEST = 400;
const UNAUTHORIZED_ERROR = 401;
const FORBIDDEN_ERROR = 403;
const NOT_FOUND = 404;
const CONFLICT_ERROR = 409;
const SERVER_ERROR = 500;

const BadRequestError = require("./BadRequestError");
const UnauthorizedError = require("./UnauthorizedError");
const ForbiddenError = require("./ForbiddenError");
const NotFoundError = require("./NotFoundError");
const ConflictError = require("./ConflictError");
const ServerError = require("./ServerError");

module.exports = { BAD_REQUEST, UNAUTHORIZED_ERROR, FORBIDDEN_ERROR, NOT_FOUND, CONFLICT_ERROR, SERVER_ERROR, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError, ServerError };