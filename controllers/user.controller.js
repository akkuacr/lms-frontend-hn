import User from "../models/ user.model.js";
import AppError from "../utils/error.utils.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto';

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
    if(!email)
    console.log("email");
    if(!password)
    console.log("password");
    if(!fullName)
    console.log("fullName");
    return next(new AppError("All fields are  necessary", 400));
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

const forgotPassword = async (req,res,next)=>{

    const { email } = req.body;
    if(!email){
      return next(new AppError('Email is required',400));
    }

    const user= await User.findOne({email});
    if(!user){
      return next(new AppError('Email not registered',400));
    }

    const resetToken = await user.generatePasswordResetToken();

    await user.save();

    const resetPasswordURL =`${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log(resetPasswordURL);

    try{
      const subject="Reset Password Url";
      const message=`You can reset your password by clicking <a href=${resetPasswordURL} `;
      await sendEmail(email,subject,message);

      res.status(200).json({
        success:true,
        message: `Reset password token has been sent to ${email} successfully`
      })    
    }catch(error){
       user.forgotPasswordExpiry = undefined;
       user.forgotPasswordToken = undefined;   

       await user.save();
       console.log("yha aya");
       return next(new AppError(error.message, 500));
    }

    
}

const resetPassword = async (req,res,next)=>{
  
   const { resetToken } = req.params;
   const { password } = req.body;

   const forgotPasswordToken = crypto 
   .createHash('sha256')
   .update(resetToken)
   .digest('hex');

   const user = await User.findOne({
      forgotPasswordToken,
      forgotPasswordExpiry:{ $gt:Date.now() }

   });

    if(!user){
      return next(
        new AppError('Token is invalid or expired,please try agin',400)
      )
    }

    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    user.save();

    res.status(200).json({
      success:true,
      message:'Password changed Successfully'

    })
}


const changePassword = async (req,res,next)=>{

  const {oldPassword,newPassword} = req.body;

  const {id} = req.user;

  if(!oldPassword || !newPassword){
    return next(
      new AppError('All Fields are mandatory',400)
    )
  }
  

  const user = await User.findById(id).select('+password');
  
  if(!user){
    return next(
      new AppError('User doesnot Exist ',400)
    )
  }

  const isPasswordValid= await user.comparePassword(oldPassword);

  if(!isPasswordValid){
    return next(
      new AppError('Invalid  old Password',400)
    )

  }

  user.password  = newPassword;
  await user.save();

  user.password =  undefined;
  res.status(200).json({
    success:true,
    message:'Password changed successfully!'
  });


}

const updateUser = async (req,res,next)=>{
  console.log('yha aya');
  const {fullName } = req.body;
  const  id  = req.user.id;


  const user = await User.findById(id);



  if(req.fullName){
    user.fullName = fullName;
  }
  console.log(id);
  console.log(user);

  if(req.file){
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    
   
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
   res.status(200).json({
    success:true,
    message:'User profile uploaded successfully'
   })


}




export { register, login, logout, getProfile,forgotPassword,resetPassword ,changePassword,updateUser };
