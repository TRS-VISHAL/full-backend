import { User } from '../models/user.model.js';
import { apiError } from '../utils/apiError.js';
import { apiResponce } from '../utils/apiResponce.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import jwt from 'jsonwebtoken';

// generate access token and refresh token

const generateAccessTokenAndRefreshToken = async (userId) => {
  // const accessToken = jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  // const refreshToken = jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

  const user = await User.findById(userId);

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

//register user

const register = asyncHandler(async (req, res) => {
  // get details from frontend api
  // validate the data
  // check user already exists
  // handle files and upload them
  // create a entry in database
  // check the user created successfully
  // send the data and remove the password and refreshToken

  const { username, fullName, email, password } = req.body;

  // validate the data
  if (
    [username, fullName, email, password].some((filed) => filed?.trim === '')
  ) {
    throw new apiError(404, 'All filed are required');
  }

  // check user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new apiError(408, 'User already exists');
  }

  // handle files and upload them
  const avatarPath = req.files?.avatar[0]?.path;
  //   const coverImagePath = req.files?.coverImage[0]?.path;

  let coverImagePath;
  if (
    req.files &&
    req.files.coverImage &&
    Array.isArray(coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImagePath = req.files.coverImage[0].path;
  }
  const avatar = await uploadOnCloudinary(avatarPath);
  const coverImage = await uploadOnCloudinary(coverImagePath);

  if (!avatar) {
    throw new apiError(500, 'Failed to upload avatar');
  }
  // create a entry in database
  const user = await new User({
    username: username.toLowerCase().trim(),
    fullName,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || '',
  });

  await user.save();

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  return res
    .status(200)
    .json(new apiResponce(201, createdUser, 'the user created successful'));
});

// get user registered

const getUser = asyncHandler(async (req, res) => {
  const user = await User.find();
  return res
    .status(200)
    .json(new apiResponce(200, user, 'the users fetched successful'));
});

//login users

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new apiError(400, 'Username or email is required');
  }

  if (!password) {
    throw new apiError(400, 'Password is required');
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new apiError(401, 'User in not available : please sign up');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new apiError(401, 'Invalid credentials : please check your password');
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedIn = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, option)
    .cookie('refreshToken', refreshToken, option)
    .json(
      new apiResponce(
        200,
        {
          user: loggedIn,
          accessToken,
          refreshToken,
        },
        'the user logged in successful'
      )
    );
});

// logout user

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findByIdAndUpdate(
    userId,
    { refreshToken: null },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(204)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new apiResponce(200 , { user: user } , "logout successfully"));
});

//REFRESH ACCRESS token

const refreshAccessToken = asyncHandler(async(req,res)=>{
  const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken

  if(!incomingToken){
    throw new apiError(401, "No refresh token provided")
  }


  try {
    const decodedJWT = jwt.verify(incomingToken,REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedJWT._id)
    if(!user){
      throw new apiError(401, "Invalid refresh token")
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

    return res
     .status(200)
     .cookie('accessToken', accessToken, { httpOnly: true, secure: true })
     .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
     .json(new apiResponce(200, { user, accessToken, refreshToken }, "Access token refreshed successfully"))


  } catch (error) {
    
  }


})


export { getUser, register, loginUser, logoutUser , refreshAccessToken};
