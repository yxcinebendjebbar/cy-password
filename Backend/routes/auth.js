const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// استدعاء أدواتك الرائعة
const { registerCheck, loginCheck } = require('../utils/validation');
const { hashPassword, comparePassword } = require('../utils/authHelper');

// 1. رابط التسجيل (REGISTER)
router.post('/register', async (req, res) => {
    // أ) التفتيش (Validation)
    const { error } = registerCheck(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // ب) التأكد أن الإيميل غير مستخدم سابقاً
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    // ج) تشفير الباسوورد (Hashing)
    const hashedPassword = await hashPassword(req.body.masterPasswordHash);

    // د) الحفظ في قاعدة البيانات
    const user = new User({
        email: req.body.email,
        passwordHash: hashedPassword
    });

    try {
        await user.save();
        res.send({ user: user._id, message: "Registered Successfully!" });
    } catch (err) {
        res.status(400).send(err);
    }
});

// 2. رابط الدخول (LOGIN)
router.post('/login', async (req, res) => {
    // أ) التفتيش
    const { error } = loginCheck(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // ب) التأكد أن المستخدم موجود
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email or Password is wrong');

    // ج) مقارنة الباسوورد (Compare)
    const validPass = await comparePassword(req.body.masterPasswordHash, user.passwordHash);
    if (!validPass) return res.status(400).send('Email or Password is wrong');

    // د) إصدار التوكن (JWT) - تصريح الدخول
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.header('auth-token', token).send({ token: token });
});

module.exports = router;