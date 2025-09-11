require('dotenv').config();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const saheliModel=require('../models/auth/saheli.auth');
const customerModel=require('../models/auth/user.auth');
const {uploadImage, uploadProfileImage}=require('../services/storage.service');
const {checkIfValid}=require('../services/ai.service');
const {sendEmail}=require('../components/email.comp');
const otpModel=require('../models/otp.model');

/**
 * --------------------
 * OTP HANDLERS
 * --------------------
 */


/**
 * --------------------
 * LOGIN HANDLER
 * --------------------
 */
async function postLoginHandler(req, res)
{
    const {email, password}=req.body;
    if (!email||!password)
    {
        return res.status(400).json({message: "Email and password are required"});
    }

    try
    {
        const user=
            (await saheliModel.findOne({email}))||
            (await customerModel.findOne({email}));

        if (!user)
        {
            return res.status(401).json({message: 'Invalid email or password'});
        }

        const isMatch=await bcrypt.compare(password, user.password);
        if (!isMatch)
        {
            return res.status(401).json({message: 'Invalid email or password'});
        }

        const role=user.constructor.modelName==='Saheli'? 'saheli':'customer';
        const token=jwt.sign({id: user._id, role}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token);
        return res.status(200).json({
            message: "Login successful",
            user: {
                email: user.email,
                name: user.name,
                role
            }
        });
    } catch (err)
    {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
}

/**
 * --------------------
 * SAHELI REGISTRATION (AFTER OTP VERIFIED)
 * --------------------
 */
async function postSaheliRegisterHandler(req, res)
{
    const {email, name, password, phone, dateOfBirth, gender}=req.body;

    if (!email||!name||!password||!phone)
    {
        return res
            .status(400)
            .json({message: "Email, name, password, and phone are required"});
    }

    try
    {
        const user=
            (await saheliModel.findOne({email}))||
            (await customerModel.findOne({email}));
        const emailOtpVerified=await otpModel.findOne({email});

        if (!emailOtpVerified)
        {
            return res.status(400).json({message: "Please verify your email first"});
        }
        if (user)
        {
            return res.status(400).json({message: "User already registered"});
        }

        let profileUrl={url: ""};
        if (req.file)
        {
            profileUrl=await uploadProfileImage(
                req.file.buffer.toString("base64"),
                name+"_"+Date.now()
            );
        }

        const newUser=await saheliModel.create({
            email,
            name,
            password: await bcrypt.hash(password, 10),
            phone,
            profileImage: profileUrl.url,
            dateOfBirth,
            gender,
            isEmailVerified: true,
        });

        await otpModel.deleteOne({email});

        const token=jwt.sign(
            {id: newUser._id, role: "saheli"}, // ✅ fixed
            process.env.JWT_SECRET,
            {expiresIn: "24h"}
        );

        res.cookie("token", token);
        return res.status(201).json({message: "Registration successful"});
    } catch (err)
    {
        console.error("Error in postSaheliRegisterHandler:", err);
        return res
            .status(500)
            .json({message: "Internal server error", error: err.message});
    }
}


/**
 * --------------------
 * SAHELI PROFILE UPDATE
 * --------------------
 */
async function postSaheliProfile(req, res)
{
    const saheliId=req.user.id;
    let {
        address,
        skills,
        experienceYears,
        bio,
        languages,
        servicesOffered,
        emergencyContact
    }=req.body;

    console.log("Incoming body:", req.body);
    console.log(req.file);

    try
    {
        const saheli=await saheliModel.findById(saheliId);
        if (!saheli)
        {
            return res.status(404).json({message: "Saheli not found"});
        }

        let proofUrl;
        let proofFile=req.files?.idProof?.[0];

        if (proofFile)
        {
            const mimeType=proofFile.mimetype;
            const base64File=proofFile.buffer.toString("base64");

            const validation=await checkIfValid(
                base64File,
                mimeType,
                `${saheli.name} ${saheli.dateOfBirth} ${saheli.gender} ${address} ${skills} ${experienceYears} ${bio} ${languages} ${servicesOffered} ${emergencyContact}`
            );
            console.log("Validation result:", validation);

            // if (validation !== "1") {
            //     return res.status(400).json({ message: "ID Proof details do not match" });
            // }

            proofUrl=await uploadImage(base64File, saheli.name+"_"+Date.now());
        }

        // ✅ Safe JSON parsing only if string
        if (skills&&typeof skills==="string")
        {
            try {skills=JSON.parse(skills);} catch {skills=saheli.skills;}
        }
        if (languages&&typeof languages==="string")
        {
            try {languages=JSON.parse(languages);} catch {languages=saheli.languages;}
        }
        if (servicesOffered&&typeof servicesOffered==="string")
        {
            try {servicesOffered=JSON.parse(servicesOffered);} catch {servicesOffered=saheli.servicesOffered;}
        }
        if (address&&typeof address==="string")
        {
            try {address=JSON.parse(address);} catch {address=saheli.address;}
        }
        if (emergencyContact&&typeof emergencyContact==="string")
        {
            try {emergencyContact=JSON.parse(emergencyContact);} catch {emergencyContact=saheli.emergencyContact;}
        }

        // ✅ Assign values
        saheli.address=address||saheli.address;
        saheli.skills=skills||saheli.skills;
        saheli.experienceYears=experienceYears||saheli.experienceYears;
        saheli.bio=bio||saheli.bio;
        saheli.languages=languages||saheli.languages;
        saheli.servicesOffered=servicesOffered||saheli.servicesOffered;
        saheli.emergencyContact=emergencyContact||saheli.emergencyContact;

        if (proofUrl)
        {
            saheli.idProof=proofUrl.url;
            saheli.verified=true;
        }

        await saheli.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            saheli
        });

    } catch (err)
    {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
}


/**
 * --------------------
 * CUSTOMER REGISTRATION
 * --------------------
 */
async function postCustomerRegisterHandler(req, res)
{
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    const {name, email, password, phone, dateOfBirth, gender}=req.body;
    let profileImage="";
    if (req.file)
    {
        profileImage=await uploadProfileImage(
            req.file.buffer.toString("base64"),
            name+"_"+Date.now()
        );
    }

    if (!name||!email||!password||!phone)
    {
        return res.status(400).json({message: "Name, email, password, and phone are required"});
    }
    try
    {
        const existingCustomer=await customerModel.findOne({email});
        if (existingCustomer)
        {
            return res.status(400).json({message: 'Email already in use'});
        }
        const hashedPassword=await bcrypt.hash(password, 10);
        const newCustomer=await customerModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            profileImage: profileImage?.url,
            dateOfBirth,
            gender
        });
        const token=jwt.sign({id: newCustomer._id, role: "customer"}, process.env.JWT_SECRET, {expiresIn: '24h'});
        res.cookie('token', token);

        return res.status(201).json({message: 'Registration successful'});
    } catch (err)
    {
        console.error(err);
        return res.status(500).json({message: "Internal server error", error: err.message});
    }
}

/**
 * --------------------
 * CUSTOMER PROFILE UPDATE
 * --------------------
 */
async function postCustomerProfile(req, res)
{
    const customerId=req.user.id;
    const {address, preferences, emergencyContact}=req.body;
    try
    {
        const customer=await customerModel.findById(customerId);
        if (!customer)
        {
            return res.status(404).json({message: 'Customer not found'});
        }

        customer.address=address||customer.address;
        customer.preferences=preferences||customer.preferences;
        customer.emergencyContact=emergencyContact||customer.emergencyContact;

        await customer.save();
        return res.status(200).json({message: 'Profile updated successfully'});
    } catch (err)
    {
        console.error(err);
        return res.status(500).json({message: "Internal server error", error: err.message});
    }
}

module.exports={

    postLoginHandler,
    postSaheliRegisterHandler,
    postSaheliProfile,
    postCustomerRegisterHandler,
    postCustomerProfile
};
