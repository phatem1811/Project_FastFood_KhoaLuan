class ApiError extends Error {
  constructor(statusCode, message, errorCode = 'ERROR_REQUEST') {
      super(message);
      
      this.name = 'ApiError';
      this.statusCode = statusCode;
      this.errorCode = errorCode; 
      
      Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
