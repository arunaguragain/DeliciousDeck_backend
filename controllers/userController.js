// const User = require('../model/User')
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

// const registerUser = async(req, res)=>{
//     const {username, password} = req.body;
//     //validate username and password
//     if(!username || !password){
//         return res.status(400).json({
//             error: "Please Insert username and password"
//         })
//     }
//     try{
//         const checkExistingUser = await User.findOne({where: {username}})
//         if(checkExistingUser){
        
//             return res.status(400).json({
//                 error: "New user required"
//             })
           
//         }
//         const saltRound = 10;
//         const hashpassword = await bcrypt.hash(password, saltRound)

//         const newUser = await User.create({username, password: hashpassword});
//         res.status(200).json({message: "Registartion Successful....."});

//     }
//     catch(error){
//         console.log(error)
//         res.status(500).json({error: "Something went Wrong"});
//     }

// }

// const loginUser = async(req, res) =>{
//     const {username, password} = req.body;
//      //validate username and password
//     if(!username || !password){
//         return res.status(400).json({
//             error: "Please Insert username and password"
//         })
//     }
//     try{
//         const user = await User.findOne({where: {username}})
//         if(!user){
//             return res.status(400).json({
//                 error: "New user required"
//             })
//         }
//         const isMatch = await bcrypt.compare(password, user.password)
//         if(!isMatch){
//             return res.status(400).json({
//                 error: "Insert proper password!!!!"
//             })
//         }
//         const token = jwt.sign(
//             {id: user.username, username: user.username},
//             process.env.JWT_SECRET || 'FVHJAFJHSFVBSFBSSFJSF',
//             {expiresIn: '24h'}

//         )
//         res.status(200).json({message: "Successfully Logged in", token},
            

//         )
//     }
//     catch(error){
//         res.status(500).json({error: "Something went Wrong"});
//         console.log(error)
    
//     }

// }
// // const getUser = async(req, res)=>{

// //     try{
// //         const tests = await User.findAll();
// //         res.status(200).json(tests);

// //     }
// //     catch(error){
// //         res.status(500).json({error: "Failed to Load"})
// //     }
// // }

// // const createUser = async(req, res)=>{
    
// //     try{
        
// // const {username, password} = req.body;

// // //Hash the password
// // const newtest = await User.create({username, password})

// // res.status(200).json(newtest);
// //     }
// //     catch(error){
// //         res.status(500).json({error: "Failed to Load"})
// //         console.log(error)
// //     }

// // }

// // const updateUser = async(req, res)=>{
// //     try {
// //         const user = await User.findByPk(req.params.id);
// //         if (!user) {
// //             return res.status(404).json({ message: 'User not found' });
// //         }
// //         await user.update(req.body);
// //         res.json(user);
// //     } catch (err) {
// //         res.status(400).json({ error: err.message });
// //     }
// // }

// // const deleteUser = async(req, res)=>{
// //     try {
// //         const user = await User.findByPk(req.params.id);
// //         if (!user) {
// //             return res.status(404).json({ message: 'User not found' });
// //         }
// //         await user.destroy();
// //         res.json({ message: 'User deleted' });
// //     } catch (err) {
// //         res.status(500).json({ error: err.message });
// //     }
// // }

// // module.exports = {createUser, getUser, deleteUser, updateUser}
// module.exports = {registerUser, loginUser}
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const  User  = require('../model/User');

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { fullName, dob, email, address, password } = req.body; // Updated to match model fields

        // Check if user already exists
        const userExists = await User.findOne({ where: { email } }); // Check by email instead of username
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            fullName,
            dob,
            email,
            address,
            password: hashedPassword  // Store the hashed password
        });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
};

// Login a user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body; // Changed to use email for login

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.userId, email: user.email }, // Using email and userId
            'your_jwt_secret_key',  // Replace with an actual secret key
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token, userId: user.userId });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};

const getProfile = async (req, res) => {
    try {
        // Verify the token and extract user ID
        const token = req.headers.authorization.split(' ')[1]; // Assuming token is passed as Bearer token
        const decoded = jwt.verify(token, 'your_jwt_secret_key');
        
        // Fetch the user from the database using userId
        const user = await User.findOne({ where: { userId: decoded.userId } });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            fullName: user.fullName,
            email: user.email,
            dob: user.dob,
            address: user.address,
            profilePicture: user.profilePicture, // If you have a profile picture column
        });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving profile', error: err.message });
    }

};

const updateProfile = async (req, res) => {
    try {
        const { fullName, dob, address, email } = req.body;
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, 'your_jwt_secret_key');
        
        // Find the user by userId
        const user = await User.findOne({ where: { userId: decoded.userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's profile details
        user.fullName = fullName || user.fullName;
        user.dob = dob || user.dob;
        user.address = address || user.address;
        user.email = email || user.email;

        if (req.file) {
            user.profilePicture = req.file.path;
          }
          

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Error updating profile', error: err.message });
    }
};

const updateProfilePicture = async (req, res) => {
    try {
        // Get the token from Authorization header
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, 'your_jwt_secret_key'); // Verify token

        // Find user in the database using the decoded userId
        const user = await User.findOne({ where: { userId: decoded.userId } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if file exists in the request
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Assuming the image is uploaded via multer
        const profilePictureUrl = req.file.path; // File path saved by multer

        // Update user's profile picture URL in the database
        user.profilePicture = profilePictureUrl;
        await user.save();

        // Return the updated profile picture URL
        res.status(200).json({
            message: 'Profile picture updated successfully',
            profilePictureUrl,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error updating profile picture',
            error: err.message,
        });
    }
};





module.exports = { registerUser, loginUser, getProfile, updateProfile, updateProfilePicture };
