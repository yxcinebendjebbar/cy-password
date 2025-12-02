const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// إعداد قوانين الحارس (كم مرة مسموح لك تطرق الباب؟)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests, please try again later."
});

// الدالة التي تركب الحماية على التطبيق
const applySecurity = (app) => {
    app.use(helmet()); 
    app.use('/api', limiter); 
};

module.exports = applySecurity;