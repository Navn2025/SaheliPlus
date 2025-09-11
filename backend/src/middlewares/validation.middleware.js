const Joi=require('joi');

/* -----------------------------------
   1. COMMON FIELDS (for both roles)
----------------------------------- */
const baseSchema=(req, res, next) =>
{
    const schema=Joi.object({
        fullName: Joi.object({
            firstName: Joi.string().min(3).max(100).required(),
            lastName: Joi.string().min(3).max(100).required()
        }).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        phone: Joi.string()
            .pattern(/^[0-9]{10}$/) // 10-digit phone number
            .required(),
        profileImage: Joi.string().uri().optional(),
        dateOfBirth: Joi.date().optional(),
        gender: Joi.string().valid("Male", "Female", "Other").optional(),

    })
    const {error}=schema.validate(req.body, {abortEarly: false});
    if (error)
    {
        return res.status(400).json({errors: error.details.map(d => d.message)});
    }
    next();
};

const validateSaheli=(req, res, next) =>
{
    const schema=Joi.object({

        skills: Joi.array().items(Joi.string()).min(1).required(),
        experienceYears: Joi.number().min(0).optional(),
        bio: Joi.string().max(300).optional(),
        languages: Joi.array().items(Joi.string()).optional(),
        address: Joi.object({
            street: Joi.string().optional(),
            city: Joi.string().optional(),
            state: Joi.string().optional(),
            pincode: Joi.string().pattern(/^[0-9]{6}$/).optional(),
        }),
        servicesOffered: Joi.array().items(
            Joi.object({
                title: Joi.string().required(),
                description: Joi.string().optional(),
                price: Joi.number().min(0).required(),
                duration: Joi.string().optional(),
            })
        ),
        emergencyContact: Joi.object({
            name: Joi.string().required(),
            phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
            relation: Joi.string().optional(),
        }).optional(),
        idProof: Joi.string().uri().optional(),
    });

    const {error}=schema.validate(req.body, {abortEarly: false});
    if (error)
    {
        return res.status(400).json({errors: error.details.map(d => d.message)});
    }
    next();
};

/* -----------------------------------
   3. CUSTOMER VALIDATION
----------------------------------- */
const validateCustomer=(req, res, next) =>
{
    const schema=Joi.object({

        address: Joi.object({
            street: Joi.string().optional(),
            city: Joi.string().optional(),
            state: Joi.string().optional(),
            pincode: Joi.string().pattern(/^[0-9]{6}$/).optional(),
        }),
        preferences: Joi.array().items(Joi.string()).optional(),
        emergencyContact: Joi.object({
            name: Joi.string().required(),
            phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
            relation: Joi.string().optional(),
        }).optional(),
    });

    const {error}=schema.validate(req.body, {abortEarly: false});
    if (error)
    {
        return res.status(400).json({errors: error.details.map(d => d.message)});
    }
    next();
};

// Middleware to validate incoming requests
function validateRequest(schema)
{
    return (req, res, next) =>
    {
        const {error}=schema.validate(req.body);
        if (error)
        {
            return res.status(400).json({message: error.details[0].message});
        }
        next();
    };
}

// Define a schema for phone number validation
const phoneValidationSchema=Joi.object({
    phone: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .messages({
            'string.pattern.base': 'Phone number must be a valid 10-digit number.',
            'any.required': 'Phone number is required.',
        }),
});

// Middleware to handle JSON parsing errors
function handleJsonParsingError(err, req, res, next)
{
    if (err instanceof SyntaxError&&err.status===400&&'body' in err)
    {
        return res.status(400).json({message: 'Invalid JSON payload'});
    }
    next();
}

module.exports={validateSaheli, validateCustomer, baseSchema, validateRequest, phoneValidationSchema, handleJsonParsingError};