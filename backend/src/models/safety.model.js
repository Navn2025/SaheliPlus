const mongoose=require('mongoose');

const safetyLocationSchema=new mongoose.Schema({
    lat: {type: Number, required: true},
    lng: {type: Number, required: true},
    rating: {type: String, enum: ['Safe', 'Unsafe'], required: true},
    comment: {type: String, default: ''},
    createdAt: {type: Date, default: Date.now}
});

module.exports=mongoose.model('SafetyLocation', safetyLocationSchema);
