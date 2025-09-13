// middlewares/roleAuth.middleware.js
const jwt=require("jsonwebtoken");
const UserModel=require("../models/auth/user.auth");
const SaheliModel=require("../models/auth/saheli.auth");

const roleAuthMiddleware=async (req, res, next) =>
{
    const token=req.cookies?.token||req.headers["authorization"]?.split(" ")[1];

    if (!token) return res.status(401).json({message: "Unauthorized: token missing"});

    try
    {
        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        const {id, role}=decoded;

        if (!id||!role)
        {
            return res.status(401).json({message: "Unauthorized: invalid token payload"});
        }

        let user;
        if (role==="user")
        {
            user=await UserModel.findById(id).select("-password");
        } else if (role==="saheli")
        {
            user=await SaheliModel.findById(id).select("-password");
        }

        if (!user)
        {
            return res.status(404).json({message: "User not found"});
        }

        req.user=user;
        req.role=role; // attach role too, in case route needs it
        next();
    } catch (err)
    {
        console.error("Role Auth Middleware Error:", err.message||err);
        if (["TokenExpiredError", "JsonWebTokenError"].includes(err.name))
        {
            return res.status(401).json({message: "Unauthorized: invalid or expired token"});
        }
        return res.status(500).json({message: "Internal server error"});
    }
};

module.exports=roleAuthMiddleware;
