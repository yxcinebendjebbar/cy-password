const mongoose = require('mongoose');

const VaultSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    siteName: {
        type: String,
        required: true, // مثلاً: Facebook
    },
    siteUrl: {
        type: String,   // مثلاً: www.facebook.com
    },
    // هنا سنخزن اسم المستخدم وكلمة المرور "مشفرين" مع بعض
    encryptedData: {
        type: String,
        required: true
    },
    // هذا الحقل (IV) أهم شيء لفك التشفير لاحقاً
    iv: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Vault', VaultSchema);