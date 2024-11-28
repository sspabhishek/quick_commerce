import UserModel from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import sendEmail from '../config/sendEmail.js';
import generatedAccessToken from '../utils/generateAccessToken.js';
import generatedRefreshToken from '../utils/generateRefreshToken.js';
import uploadImageClodinary from '../utils/uploadimageClodinary.js';
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js';
import generatedOtp from '../utils/generatedOtp.js';
import jwt from 'jsonwebtoken';


export async function registerUserController(request, response) {
    try {
        const { name, email, password } = request.body;
        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Plese fill the required fields",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email });
        if (user) {
            return response.json({
                message: "User already exists",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        const payload = {
            name,
            email,
            password: hashPassword
        }

        const newUser = new UserModel(payload);
        const save = await newUser.save();

        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`;

        const verifyEmail = await sendEmail({
            sendTo: email,
            subject: "Email Verification from Binkeyit",
            html: verifyEmailTemplate({
                name,
                url: verifyEmailUrl
            })
        })

        return response.json({
            message: "User registered successfully",
            error: false,
            success: true,
            data: save
        })

    } catch (error) {
        response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export async function verifyEmailController(request, response) {
    try {
        const { code } = request.body;

        const user = await UserModel.findOne({ _id: code });

        if (!user) {
            return response.status(400).json({
                message: "Invalid verification code",
                error: true,
                success: false
            })
        }

        const updateUser = await UserModel.updateOne({ _id: code }, {
            verify_email: true
        });

        return response.json({
            message: "Email verified successfully",
            error: false,
            success: true,
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: true
        })
    }
}

//login controller

export async function loginController(request, response) {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({
                message: "Please provide email and password",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "User does not exists",
                error: true,
                success: false
            })
        }

        if (user.status !== "Active") {
            return response.status(400).json({
                message: "Contact to admin",
                error: true,
                success: false
            })
        }


        const checkPassword = await bcryptjs.compare(password, user.password);

        if (!checkPassword) {
            return response.status(400).json({
                message: "Check your password",
                error: true,
                success: false
            })
        }

        const accesstoken = await generatedAccessToken(user._id);
        const refreshtoken = await generatedRefreshToken(user._id);


        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.cookie('accessToken', accesstoken, cookiesOption);
        response.cookie('refreshToken', refreshtoken, cookiesOption);

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            last_login_date : new Date()
        })


        return response.json({
            message: "Login successfully",
            error: false,
            success: true,
            data: {
                accesstoken,
                refreshtoken
            }
        })



    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: true
        })
    }
}

//logout controller

export async function logoutController(request, response) {
    try {

        const userId = request.userId; //came from auth middleware

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.clearCookie('accessToken');
        response.clearCookie('refreshToken');

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
            refresh_token: ""
        })

        return response.json({
            message: "Logout successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: true
        })

    }
}

//upload user avatar 

export async function uploadAvatar(request, response) {
    try {
        const userId = request.userId; //came from auth middleware
        const image = request.file; //came from multer middleware

        const upload = await uploadImageClodinary(image);

        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            avatar: upload.url
        })

        return response.json({
            message: "upload profile",
            success: true,
            error: false,
            data: {
                _id: userId,
                avatar: upload.url
            }
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: true
        })

    }
}

//update usse details

export async function updateUserDetails(request, response) {
    try {
        const userId = request.userId; //came from auth middleware
        const { name, email, mobile, password } = request.body;

        let hashPassword = ""

        if (password) {
            const salt = await bcryptjs.genSalt(10);
            const hashPassword = await bcryptjs.hash(password, salt);
        }

        const updateUser = await UserModel.updateOne({ _id: userId }, {
            ...(name && { name: name }),
            ...(email && { email: email }),
            ...(mobile && { mobile: mobile }),
            ...(password && { password: hashPassword })
        })

        return response.json({
            message: "Updated successfully",
            error: false,
            success: true,
            data: updateUser
        })



    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })

    }
}

//forget password when user not login

export async function forgetPasswordController(request, response) {
    try {
        const { email } = request.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "Email not aviailable",
                error: true,
                success: false
            })
        }

        const otp = generatedOtp()
        const expaireTime = new Date() + 60 * 60 * 1000; //1 hour

        const update = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(expaireTime).toISOString()
        })

        await sendEmail({
            sendTo: email,
            subject: "Forget Password from Binkeyit",
            html: forgotPasswordTemplate({
                name: user.name,
                otp: otp
            })
        })

        return response.json({
            message: "Check your email",
            error: false,
            success: true
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })

    }
}


//verify forget password otp

export async function verifyForgetPasswordOtp(request, response) {
    try {
        const { email, otp } = request.body;

        if (!email || !otp) {
            return response.status(400).json({
                message: "Please provide email and otp",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "Email not aviailable",
                error: true,
                success: false
            })
        }

        const currentTime = new Date().toISOString();
        if (user.forgot_password_expiry < currentTime) {
            return response.status(400).json({
                message: "OTP is expired",
                error: true,
                success: false
            })
        }

        if (otp !== user.forgot_password_otp) {
            return response.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false
            })
        }

        //if otp is not expaired
        //otp === user.forgot_password_otp

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            forgot_password_otp : "",
            forgot_password_expiry : ""
        })

        return response.json({
            message: "OTP verified successfully",
            error: false,
            success: true
        })




    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })

    }
}


//reset the password

export async function resetPassword(request, response) {
    try {
        const { email, newPassword, confirmPassword } = request.body;

        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: "Please required fields, email, new password, confirm password",
            })
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "Email is not aviailable",
                error: true,
                success: false
            })
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "newPassword and confirmPassword must be same",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(newPassword, salt);

        const update = await UserModel.findOneAndUpdate(user._id, {
            password: hashPassword
        })

        return response.json({
            message: "Password updated successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })

    }
}


//refresh token controller

export async function refreshToken(request, response) {
    try {
        const refreshToken = request.cookies.refreshToken  || request?.headers?.authorization?.split(" ")[1]   // [Bearer, token]

        if(!refreshToken){
            return response.status(401).json({
                message: "Invalid token",
                error: true,
                success: false
            })
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);

        if(!verifyToken){
            return response.status(401).json({
                message: "token is expired",
                error: true,
                success: false
            })
        }
        console.log("verifyToken", verifyToken)

        const userId = verifyToken?.id;

        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.cookie('accessToken', newAccessToken, cookiesOption )

        return response.json({
            message: "New access token generated",
            error: false,
            success: true,
            data: {
                accesstoken: newAccessToken
            }
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })

    }
}


//get login user details
export async function userDetails(request,response){
    try {
        const userId  = request.userId

        console.log(userId)

        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return response.json({
            message : 'user details',
            data : user,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : "Something is wrong",
            error : true,
            success : false
        })
    }
}