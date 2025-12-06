import CryptoJS from 'crypto-js';

// 1. التشفير: ينتج لنا (بيانات مشفرة + IV)
export const encryptData = (text, secretKey) => {
    if (!text || !secretKey) return null;

    // CryptoJS يقوم بتوليد IV عشوائي تلقائياً هنا
    const encryptedObject = CryptoJS.AES.encrypt(text, secretKey);

    return {
        // هذا هو النص المشفر
        encryptedData: encryptedObject.toString(),
        // هذا هو الـ IV الذي يطلبه الباك إند (نحوله لنص لنخزنه)
        iv: encryptedObject.iv.toString()
    };
};

// 2. فك التشفير
export const decryptData = (encryptedData, secretKey) => {
    try {
        if (!encryptedData || !secretKey) return "";

        // ملاحظة ذكية: مكتبة CryptoJS تدمج الـ IV داخل النص المشفر (encryptedData)
        // لذلك عند فك التشفير، هي تعرف الـ IV تلقائياً ولا تحتاج أن نمرره لها يدوياً هنا
        // لكننا خزناه في الداتا بيز للأغراض الأمنية والمعيارية فقط.
        
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        
        return originalText;
    } catch (error) {
        console.error("خطأ في فك التشفير", error);
        return "";
    }
};