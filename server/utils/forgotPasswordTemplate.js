const forgotPasswordTemplate = ({name, otp}) => {
    return `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
        <h2 style="color: #333;">Dear, ${name}</h2>
        <p style="color: #555;">Here is your OTP to reset your password:</p>
        <div style="background-color: #e0e0e0; padding: 10px; border-radius: 5px; text-align: center;">
            <h1 style="color: #d9534f;">${otp}</h1>
        </div>
        <p style="color: #555;">This OTP is valid for 1 hour only. Enter this OTP to reset your password.</p>
        <br>
        <br>
        <p style="color: #555;">Thanks,</p>
        <p style="color: #555;">Binkeyit</p>
    </div>
    `
}

export default forgotPasswordTemplate;