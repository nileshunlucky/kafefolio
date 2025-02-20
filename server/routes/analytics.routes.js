import express from "express";
import { userAnalytics , userTrack} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/user/:user", userAnalytics);

router.post("/track", userTrack);

export default router;
