class apiError extends Error {
     constructor(
          statusCode,
          message = "error occurred",
          error,
          stack 
     ){
          super(message)
          this.statusCode = statusCode
          this.error = error
          if(stack){
                this.stack = stack
          }else{
                Error.captureStackTrace(this, this.constructor)
          }
     }
}

export {apiError}