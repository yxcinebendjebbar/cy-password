const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. البحث عن التوكن في عنوان الطلب (Header)
    const token = req.header('auth-token');
    
    // 2. إذا لم يجد التوكن -> طرد
    if (!token) return res.status(401).send('Access Denied');

    try {
        // 3. فحص التوكن: هل هو سليم أم مزور؟
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. إذا سليم، نضع بيانات المستخدم داخل الطلب لنستخدمها لاحقاً
        req.user = verified;
        next(); // اسمح له بالمرور
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};