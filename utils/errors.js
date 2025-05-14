const BAD_REQUEST = 400;
const UNAUTHORIZED_ERROR = 401;
const FORBIDDEN_ERROR = 403;
const NOT_FOUND = 404;
const CONFLICT_ERROR = 409;
const SERVER_ERROR = 500;

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN_ERROR;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_ERROR;
  }
}

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = SERVER_ERROR;
  }
}



module.exports = { BAD_REQUEST, UNAUTHORIZED_ERROR, FORBIDDEN_ERROR, NOT_FOUND, CONFLICT_ERROR, SERVER_ERROR, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError, ServerError };