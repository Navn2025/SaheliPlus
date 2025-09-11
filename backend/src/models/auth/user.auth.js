const mongoose=require("mongoose");

const {Schema}=mongoose;

const customerSchema=new Schema(
    {
        name: {type: String, required: true, trim: true},

        email: {type: String, required: true, unique: true, lowercase: true},
        password: {type: String, required: true},
        phone: {type: String, required: true},
        profileImage: {type: String, default: ""},
        dateOfBirth: {type: Date},
        gender: {type: String},

        address: {
            street: String,
            city: String,
            state: String,
            pincode: String,
        },
        preferences: [{type: String}],
        favoriteSahelis: [{type: Schema.Types.ObjectId, ref: "Saheli"}],
        servicesRequired: [
            {
                _id: {type: Schema.Types.ObjectId, auto: true},
                title: String,
                description: String,
                price: Number,
                duration: String,

                location: {
                    latitude: Number,
                    longitude: Number,
                },

            },
        ],
        bookings: [
            {
                saheliId: {type: Schema.Types.ObjectId, ref: "Saheli", required: true},
                saheliName: {type: String, required: true},
                serviceId: {type: Schema.Types.ObjectId, required: true},
                serviceTitle: {type: String, required: true},
                bookingDate: {type: Date, default: Date.now},
                status: {type: String, enum: ["pending", "accepted", "rejected"], default: "pending"},
                notes: {type: String}, // optional message from customer
            },
        ],

        emergencyContact: {
            name: String,
            phone: String,
            relation: String,
        },
        otp: {type: String}, // hashed OTP
        otpExpires: {type: Date},
        isEmailVerified: {type: Boolean, default: false},
        isPhoneVerified: {type: Boolean, default: false},
        role: {type: String, default: "customer"}

    },
    {timestamps: true}
);
const customerModel=mongoose.model("Customer", customerSchema);
module.exports=customerModel;
