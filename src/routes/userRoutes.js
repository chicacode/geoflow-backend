import express  from "express";

const router = express.Router();
import { register, 
    auth, verification, 
    recoverPassword, checkToken, 
    newPassword, profile } from "../controllers/userController.js";

import checkAuth from "../middleware/checkAuth.js";

// Register and user auth
router.post('/', register);
router.post("/login", auth);
router.get("/verification/:token", verification);
router.post("/recover-password", recoverPassword);
router.get("/recover-password/:token", checkToken);
router.post("/recover-password/:token", newPassword);
router.get("/profile", checkAuth, profile)


export default router;