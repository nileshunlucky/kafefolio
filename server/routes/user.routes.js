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
    activePro,
    linkMedia,
    deleteMedia,
    linkImg
} from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();

// Protected Routes
router.get('/profile', verifyToken, UserProfile);
router.post('/upload', verifyToken, upload.single('image'), uploadProfilePic);
router.post('/post', verifyToken, (req, res, next) => {
    if (!req.user.isPro && req.file?.mimetype.startsWith("video/")) {
        return res.status(403).json({ message: "Upgrade to Pro to upload videos." });
    }
    upload.single('image')(req, res, next);
}, portfolioPost);
router.post('/media', verifyToken, upload.single('image'), linkMedia);
router.post('/about', verifyToken, upload.single('image'), aboutUser);
router.post('/link', verifyToken, upload.single('image'), linkImg);
router.post('/activate-pro', verifyToken, activePro);
router.put('/aboutme', verifyToken, aboutMe);
router.get('/logout', verifyToken, logoutUser);
router.put('/update', verifyToken, updateUser);
router.delete('/delete', verifyToken, deleteUser);
router.delete('/postDelete', verifyToken, deletePortfolioPost);
router.delete('/mediaDelete', verifyToken, deleteMedia);

// Dynamic Route
router.get('/:username', verifyToken, userPortfolio)

export default router;