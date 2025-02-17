//auth middleware

import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


export const verifyJWT = asyncHandler(async(req,res,next)=>{
     
     try {
          const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
     
          if(!token){
               throw new apiError("Not authenticated")
          }
     
          const decodedJWT = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
     
          const user = await User.findById(decodedJWT._id)
     
          if(!user){
               throw new apiError("you are not authenticated")
          }
     
          req.user = user
          next()
     
     } catch (error) {
          throw new apiError(404 , "Authentation failed")
     }


})