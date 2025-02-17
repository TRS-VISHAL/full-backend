import { app } from "./app.js";
import dotenv from "dotenv"
import { connectDb } from "./db/index.js";

dotenv.config({path:"../.env"});

const PORT = process.env.PORT || 3000;

connectDb()
.then((res)=>{
     app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
          console.log(`http://localhost:${PORT}`);
      });
      
      app.get('/', (req, res) => {
           res.send('Hello, World! NEW fdsa');
      })
      
})