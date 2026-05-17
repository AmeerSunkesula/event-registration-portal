import express from "express"
import { register, login, requestPasswordReset } from "../controllers/authController.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/request-reset", requestPasswordReset)

export default router
