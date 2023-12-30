const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

//need email and password in body
//post request
//address --> localhost:4200/user/signup
exports.user_signup = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hashedPassword
        });
        const result = await user.save();
        console.log(result);
        res.status(201).json({
            message: 'User created',
            userId: result._id,
            email: result.email
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//need email and password , post request
//address --> localhost:4200/user/login
exports.user_login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (isPasswordValid) {
            const token = jwt.sign(
                { email: user.email, userId: user._id },
                process.env.JWT_KEY,
                { expiresIn: '1h' }
            );
            return res.status(200).json({
                message: 'Authentication successful',
                userId: _id,
                token: token
            });
        } else {
            return res.status(401).json({ message: 'Authentication failed' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//delete request ,Authentication, userId needed
//address --> localhost:4200/user.userId
exports.user_delete = async (req, res, next) => {
    try {
        await User.deleteOne({ _id: req.params.userId })
        res.status(200).json({
            message: 'User deleted'
        })
    }
    catch (error) {
        res.status(500).json({ error: 'Could not delete' })
    }
}