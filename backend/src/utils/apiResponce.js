class apiResponce {
     constructor(statusCode, message= "success", data) {
         this.statusCode = statusCode;
         this.message = message;
         this.data = data;
         this.success = statusCode < 300
     }
}

export { apiResponce }