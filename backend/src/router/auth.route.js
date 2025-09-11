const express=require('express');
const {
    postLoginHandler,
    postSaheliRegisterHandler,
    postCustomerRegisterHandler,
    postSaheliProfile,
    postCustomerProfile,

}=require('../controllers/auth.controller');  // make sure postCustomerProfile is exported

const {
    baseSchema,
    validateSaheli,
    validateCustomer,
    validateRequest,
    phoneValidationSchema,
    handleJsonParsingError
}=require('../middlewares/validation.middleware');

const router=express.Router();
const multer=require('multer');
const authMiddleware=require('../middlewares/auth.middleware');
const {sendOtpHandler, verifyOtpHandler}=require('../controllers/otp.controller');
const saheliModel=require('../models/auth/saheli.auth');
const customerModel=require('../models/auth/user.auth');


const upload=multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: 5*1024*1024}, // 5MB limit
}).fields([
    {name: 'profileImage', maxCount: 1},
    {name: 'idProof', maxCount: 1},
]);
const uploadCustomer=multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: 5*1024*1024}
}).single('profileImage')

// Apply middleware to handle JSON parsing errors
router.use(handleJsonParsingError);

// Login
router.post('/login', express.json(), postLoginHandler);

// Saheli register + profile
router.post('/register/saheli', upload, postSaheliRegisterHandler);
router.post('/register/saheli/profile', authMiddleware(saheliModel), upload, postSaheliProfile);

// Customer register + profile
router.post('/register/customer', uploadCustomer, postCustomerRegisterHandler);
router.post('/register/customer/profile', authMiddleware(customerModel), postCustomerProfile);

// OTP
router.post('/send-otp', express.json(), sendOtpHandler);
router.post('/verify-otp', express.json(), verifyOtpHandler);

// Example route with phone number validation
router.post('/example-route', validateRequest(phoneValidationSchema), (req, res) =>
{
    const {phone}=req.body;
    res.status(200).json({message: `Phone number ${phone} is valid.`});
});

module.exports=router;
