import express from 'express';
import {
    UserProfile,
    uploadProfilePic,
    portfolioPost,
    deletePortfolioPost,
    logoutUser,
    deleteUser,
    updateUser,
    userPortfolio,
    aboutUser,
    aboutMe,
    activePro
} from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();

// Protected Routes
router.get('/profile', verifyToken, UserProfile);
router.post('/upload', verifyToken, upload.single('image'), uploadProfilePic);
router.post('/post', verifyToken, upload.single('image'), portfolioPost);
router.post('/about', verifyToken, upload.single('image'), aboutUser);
router.post('/activate-pro', verifyToken, activePro);
router.put('/aboutme', verifyToken, aboutMe);
router.get('/logout', verifyToken, logoutUser);
router.put('/update', verifyToken, updateUser);
router.delete('/delete', verifyToken, deleteUser);
router.delete('/postDelete', verifyToken, deletePortfolioPost);

// Dyanmic Route
router.get('/:username', verifyToken, userPortfolio)

export default router;