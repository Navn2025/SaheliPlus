const express=require('express');
const { reverseGeocode } = require('../controllers/location.controller');
const router=express.Router();
router.get('/reverse-geocode', reverseGeocode);
module.exports=router;
