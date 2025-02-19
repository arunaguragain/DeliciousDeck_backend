
// const express = require('express')

// const router = express.Router();

// const userController = require('../controllers/userController')

// router.post('/login',userController.loginUser)
// router.post('/register',userController.registerUser)
// // router.get('/view_users',userController.getUser)
// // router.post('/create_users',userController.createUser)

// // router.put('/:id',userController.updateUser)
// // router.delete('/:id',userController.deleteUser)

// module.exports = router;


const express = require('express');
const router = express.Router();
const upload = require('../middleware/imageUpload')
const authMiddleware  = require('../middleware/authorization');
const { registerUser, loginUser, getProfile, updateProfile,  } = require('../controllers/userController');

// Register route
router.post('/register', registerUser);  // Register user

// Login route
router.post('/login', loginUser);  // Login user

// Profile routes
// router.get('/profile', getProfile);
// router.put('/profile', updateProfile);
// router.put('/profile/picture', updateProfilePicture);

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, upload.single('profilePic'), updateProfile);
// router.put('/profile', authMiddleware, updateProfile);
// router.put('/updateProfilePicture', authMiddleware,upload.single('profilePicture'), updateProfilePicture);

router.get('/admin-dashboard', authMiddleware(['admin']), (req, res) => {
    res.json({ message: 'Welcome Admin!' });
});

module.exports = router;
  


 






