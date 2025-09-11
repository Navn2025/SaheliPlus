const jwt=require("jsonwebtoken");

const authMiddleware=(model) => async (req, res, next) =>
{
    const token=req.cookies?.token;
    if (!token) return res.status(401).json({message: 'Unauthorized: authentication cookie missing'});

    if (!process.env.JWT_SECRET)
    {
        console.error('JWT_SECRET not set');
        return res.status(500).json({message: 'Server configuration error'});
    }

    try
    {
        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        const userId=decoded.id||decoded._id||decoded.userId;
        if (!userId) return res.status(401).json({message: 'Unauthorized: invalid token payload'});

        const user=await model.findById(userId);
        if (!user) return res.status(401).json({message: 'Unauthorized: user not found'});

        req.user=user;
        next();
    } catch (err)
    {
        console.error('Auth middleware error:', err.message||err);
        if (['TokenExpiredError', 'JsonWebTokenError'].includes(err.name))
        {
            return res.status(401).json({message: 'Unauthorized: invalid or expired token'});
        }
        return res.status(500).json({message: 'Internal server error'});
    }
};

module.exports=authMiddleware;
