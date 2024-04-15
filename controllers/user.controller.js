import User from "../models/ user.model.js";
import AppError from "../utils/error.utils.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises';
const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
};

const register = async (req, res, next) => {
  //console.log("yha aya");
  const { fullName, email, password } = req.body;
  console.log(req.body);

  if (!fullName || !email || !password) {
    console.log(password);
    return next(new AppError("All fields are not necessary", 400));
  }

  const userExists = await User.findOne({ email });
  //  console.log(userExists);
  if (userExists) {
    return next(new AppError("User already exists", 409));
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url: "abc.txt",
    },
  });

  if (!user) {
    return next(new AppError("User registration Failed,please try again", 400));
  }

  //TODO :file upload
  //  console.log(req.file); 

   if(req.file){
    console.log(req.file);
    try{
       const result  = await cloudinary.v2.uploader.upload(req.file.path,{
            folder:'lms',
            width:250,
            height:250,
            gravity: 'faces',
            crop:'fill'

       });

       console.log(result);

       if(result){
        user.avatar.public_id= result.public_id;
        user.avatar.secure_url = result.secure_url;
       }

       // remove file from server
      fs.rm(`uploads/${req.file.filename}`)


    }catch(e){
      return next(new AppError("File upload usnsuccessful", 500));
    }
   }


  await user.save();
  user.password = undefined;

  const token = await user.generateJWTToken();

  if (!token) {
    return next(new AppError("Token ni bna", 400));
  }

  res.cookie("token", token, cookieOptions);

  res.status(201).json({
    success: "true",
    message: "User registered Successfully",
    user,
  });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!(user && (await user.comparePassword(password)))) {
      return next(new AppError("Email or password doesnot match"));
    }

    const token = await user.generateJWTToken();
    user.password = undefined;

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "User loggedin Successfully",
      user,
    });
  } catch (e) {
     return next(new AppError(e.message,500));
  }
};

const logout = (req, res) => {
  res.cookie("token", null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "User logged Out successfully",
  });
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    res.status(200).json({
      success: true,
      message: "User details",
      user,
    });
  } catch (e) {
    return next(new AppError("Failed to fetch user profile"));
  }
};

export { register, login, logout, getProfile };
