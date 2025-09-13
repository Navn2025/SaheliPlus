const jwt=require('jsonwebtoken');
const customerModel=require('../models/auth/user.auth');
const saheliModel=require('../models/auth/saheli.auth');

const socketAuthMiddleware=async (socket, next) =>
{
    try
    {
        const token=socket.handshake.auth.token;
        if (!token)
        {
            return next(new Error('Authentication required'));
        }

        if (!process.env.JWT_SECRET)
        {
            console.error('JWT_SECRET not set');
            return next(new Error('Server configuration error'));
        }

        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        const userId=decoded.id||decoded._id||decoded.userId;
        if (!userId)
        {
            return next(new Error('Invalid token payload'));
        }

        // Try to find user in both models
        const user=await customerModel.findById(userId)||await saheliModel.findById(userId);
        if (!user)
        {
            return next(new Error('User not found'));
        }

        // Attach user data to socket
        socket.user=user;
        next();
    } catch (err)
    {
        console.error('Socket auth middleware error:', err.message||err);
        next(new Error('Authentication failed'));
    }
};

module.exports=socketAuthMiddleware;