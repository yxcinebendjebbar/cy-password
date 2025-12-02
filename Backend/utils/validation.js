// اسم الملف: validation.js
const Joi = require('joi');

// 1. قوانين تفتيش التسجيل (Registration Validation)
const registerCheck = (data) => {
    // نضع القوانين (Schema)
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        masterPasswordHash: Joi.string().min(6).required()
    });
    
    // ننفذ التفتيش على البيانات القادمة
    return schema.validate(data);
};

// 2. قوانين تفتيش تسجيل الدخول (Login Validation)
const loginCheck = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        masterPasswordHash: Joi.string().required()
    });
    
    return schema.validate(data);
};

module.exports = { registerCheck, loginCheck };