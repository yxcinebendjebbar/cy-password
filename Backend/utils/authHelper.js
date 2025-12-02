const bcrypt = require('bcryptjs');

// الدالة الأولى: التشفير (Hashing)
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10); 
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
};

// الدالة الثانية: المقارنة (Verification)
const comparePassword = async (inputPassword, storedHash) => {
    return await bcrypt.compare(inputPassword, storedHash);
};

module.exports = { hashPassword, comparePassword };