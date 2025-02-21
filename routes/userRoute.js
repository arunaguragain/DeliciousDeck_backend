const express = require('express');
const router = express.Router();
const upload = require('../middleware/imageUpload')
const authMiddleware  = require('../middleware/authorization');
const { registerUser, loginUser, getProfile, updateProfile,  } = require('../controllers/userController');

router.post('/register', registerUser);  

router.post('/login', loginUser);  

// router.get('/profile', getProfile);
// router.put('/profile', updateProfile);
// router.put('/profile/picture', updateProfilePicture);

router.get('/profile', authMiddleware(), getProfile);
router.put('/profile', authMiddleware(), upload.single('profilePic'), updateProfile);


router.get('/admin-dashboard', authMiddleware(['admin']), (req, res) => {
    res.json({ message: 'Welcome Admin!' });
});

module.exports = router;
  


 






