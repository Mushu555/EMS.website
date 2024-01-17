import jwt from "jsonwebtoken";
export const generateLogToken=(user)=>{
    return jwt.sign(
        {
            _id:user._id,
            fullname:user.fullname,
            mail:user.email,
        },
        process.env.JWT_PASS || 'Mushu45',
        {
            expiresIn:'10d',
        }

    );
};