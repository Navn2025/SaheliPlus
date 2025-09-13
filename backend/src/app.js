require('dotenv').config();
const express=require('express');
const cookieParser=require('cookie-parser');
const cors=require('cors');
const authRoutes=require('./router/auth.route');
const locationRoutes=require('./router/location.routes');
const liveLocation=require('./router/livelocation.routes')
const safetyLocationRoute=require('./router/safety.route')
//saheli
const bookCustomerService=require('./router/saheli.router/bookCustomerService.route')
const getAllServiceRequired=require('./router/saheli.router/getAllServiceRequired.route');
const listAllBookings=require('./router/saheli.router/listAllBookings.route')
const saheliAddService=require('./router/saheli.router/saheliAddService.route')
const saheliApproveBooking=require('./router/saheli.router/saheliApproveBooking.route')
//user
const acceptOrRejectSaheli=require('./router/user.router/acceptOrRejectSaheli.route');
const bookSaheli=require('./router/user.router/bookSaheli.route');
const customerAddService=require('./router/user.router/customerAddService.route');
const getAllServiceOffered=require('./router/user.router/getAllServiceOffered.route');
const listAllSaheliBooking=require('./router/user.router/listAllSaheliBooking.route');
const sos=require('./router/sos.route')
const app=express();

// ⚡ Correct CORS setup
app.use(cors({
    origin: "https://saheliplus-3.onrender.com/",
    credentials: true,
}));

app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb", extended: true}));
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/location', locationRoutes);
app.use('/', sos);
app.use('/', liveLocation)
app.use('/api/safety-locations', safetyLocationRoute);
//saheli
app.use('/saheli', bookCustomerService)
app.use('/customer', getAllServiceOffered)
app.use('/saheli', listAllBookings)
app.use('/saheli', saheliAddService)
app.use('/saheli', saheliApproveBooking)

//customer
app.use('/customer', acceptOrRejectSaheli)
app.use('/customer', bookSaheli)
app.use('/customer', customerAddService)
app.use('/saheli', getAllServiceRequired)
app.use('/customer', listAllSaheliBooking)

module.exports=app;
