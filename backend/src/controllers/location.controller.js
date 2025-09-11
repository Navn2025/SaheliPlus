const axios=require('axios');

async function reverseGeocode(req,res){
    const {lat,lon}=req.query;
    if(!lat||!lon){
        return res.status(400).json({error:'Latitude and longitude are required'});
    }
    try{
        const response=await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`);
        const data=response.data;
        res.json(data);

    }
    catch(error){
        console.error('Error fetching reverse geocoding:',error);
        res.status(500).json({error:'Failed to fetch reverse geocoding'});
    }
}
module.exports={reverseGeocode};