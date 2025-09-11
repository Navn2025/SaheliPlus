const mongoose=require("mongoose");
const {Schema}=mongoose;

const saheliSchema=new Schema(
    {
        /* -------- STEP 1: Basic Registration -------- */
        name: {type: String, required: true, trim: true},
        googleId: {type: String}, // for Google OAuth
        email: {type: String, required: true, unique: true, lowercase: true},
        password: {type: String, required: true},
        phone: {type: String, required: true},
        profileImage: {type: String, default: ""}, // cloud URL or base64
        dateOfBirth: {type: Date},
        gender: {type: String, enum: ["Female", "Other"], default: "Female"},

        /* -------- STEP 2: Profile Completion -------- */
        address: {
            street: String,
            city: String,
            state: String,
            pincode: String,
        },
        skills: [{type: String}], // e.g., ["Tailoring", "Cooking"]
        experienceYears: {type: Number, default: 0},
        bio: {type: String, maxlength: 300}, // short intro about her
        languages: [{type: String}], // e.g., ["Hindi", "English"]

        // service & ratings
        servicesOffered: [
            {
                _id: {type: Schema.Types.ObjectId, auto: true},
                title: String,
                description: String,
                price: Number,
                duration: String,

            },
        ],
        bookings: [
            {
                customerId: {type: Schema.Types.ObjectId, ref: "Customer", required: true},
                customerName: {type: String, required: true},
                serviceId: {type: Schema.Types.ObjectId, required: true},
                serviceTitle: {type: String, required: true},
                bookingDate: {type: Date, default: Date.now},
                status: {type: String, enum: ["pending", "accepted", "rejected"], default: "pending"},
                notes: {type: String}, // optional message from customer
            },
        ],
        rating: {type: Number, default: 0},
        verified: {type: Boolean, default: false},

        // safety / documents
        idProof: {type: String}, // store file URL or filename
        emergencyContact: {
            name: String,
            phone: String,
            relation: String,
        },
        isEmailVerified: {type: Boolean, default: false},
        isPhoneVerified: {type: Boolean, default: false},
        role: {type: String, default: "saheli"}



    },
    {timestamps: true}
);
const saheliModel=mongoose.model("Saheli", saheliSchema);

module.exports=saheliModel;