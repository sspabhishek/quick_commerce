const verifyEmailTemplate = ({name, url}) => {
    return `
    <p>Dear ${name},</p>
    <p>Thanks for signing up Binkeyit.</p>
    <a href="${url}" style="display: inline-block; color: white; background-color: #071263; margin-top: 10px; padding: 15px 30px; text-align: center; text-decoration: none; font-weight: bold; border-radius: 5px;">
        Verify Email
    </a>
    
    `

}

export default verifyEmailTemplate;