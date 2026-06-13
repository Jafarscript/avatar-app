import express from express;
import bcrypt from bcrypt;
import jwt from "jsonwebtoken";
import User from "../model/User.js";


const router = express.Router();

router.post("/register", async(req, res) => {
    const {userName, email, password, displayName} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            userName,
            email,
            password,
            displayName
        })
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

export default router;