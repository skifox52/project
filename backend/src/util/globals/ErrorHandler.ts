//custom error handler
export function ErrorHandler(message: string, statusCode?: number) {
  const error = new Error(message)
  this.message = error.message
  this.statusCode = statusCode
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, ErrorHandler)
  } else {
    this.stack = new Error().stack
  }
}
ErrorHandler.prototype = Object.create(Error.prototype)
ErrorHandler.prototype.contructor = ErrorHandler
