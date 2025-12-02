const router = require('express').Router();
const Vault = require('../models/Vault');
const verify = require('./verifyToken'); // استدعاء البواب

// 1. رابط إضافة باسوورد جديد (محمي بـ verify)
router.post('/add', verify, async (req, res) => {
    
    // إنشاء عنصر جديد في الخزنة
    const newEntry = new Vault({
        userId: req.user._id, // نأخذ الآيدي من التوكن مباشرة
        siteName: req.body.siteName,
        siteUrl: req.body.siteUrl,
        encryptedData: req.body.encryptedData, // البيانات المشفرة القادمة من الفرونت
        iv: req.body.iv
    });

    try {
        const savedEntry = await newEntry.save();
        res.send({ id: savedEntry._id, message: "Password Saved Securely!" });
    } catch (err) {
        res.status(400).send(err);
    }
});

// 2. رابط جلب كل الباسووردات الخاصة بالمستخدم فقط
router.get('/all', verify, async (req, res) => {
    // ابحث في الخزنة عن العناصر التي يملكها هذا المستخدم فقط
    const vaults = await Vault.find({ userId: req.user._id });
    res.json(vaults);
});

// 3. رابط تعديل باسوورد موجود (Update)
// نستخدم :id لنعرف أي باسوورد نريد تعديله
router.put('/update/:id', verify, async (req, res) => {
    try {
        // نبحث عن العنصر ونحدثه
        // الشرط المهم: يجب أن يطابق الآيدي الخاص بالعنصر + الآيدي الخاص بالمستخدم (للحماية)
        const updatedEntry = await Vault.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id }, // شرط البحث
            {
                $set: {
                    siteName: req.body.siteName,
                    siteUrl: req.body.siteUrl,
                    encryptedData: req.body.encryptedData,
                    iv: req.body.iv
                }
            },
            { new: true } // لكي يرجع لنا البيانات الجديدة بعد التعديل
        );

        if (!updatedEntry) return res.status(404).send("Item not found or you don't own it");
        
        res.json({ message: "Updated Successfully!", data: updatedEntry });
    } catch (err) {
        res.status(400).send(err);
    }
});

// 4. رابط حذف باسوورد (Delete)
router.delete('/delete/:id', verify, async (req, res) => {
    try {
        // نحذف العنصر بشرط أن يكون ملكاً للمستخدم
        const deletedEntry = await Vault.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user._id 
        });

        if (!deletedEntry) return res.status(404).send("Item not found or you don't own it");

        res.json({ message: "Deleted Successfully!" });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;

