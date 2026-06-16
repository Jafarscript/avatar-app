import express from "express";
import User from "../model/User.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";


const router = express.Router();

router.get("/", auth, async (req, res) => {
    try {
        const profile = await User.findById(req.user.id).select("-password")
        res.status(200).json(profile)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.patch("/", auth, async (req, res) => {
    try {
        
        const updateProfile = await User.findByIdAndUpdate(req.user.id,
            {$set: {displayName: req.body.displayName, bio: req.body.bio}},
            {returnDocument: true, runValidators: true}
        ).select("-password");

        if (!updateProfile) return res.status(404).send("Item not found");
        res.status(200).json(updateProfile);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


router.patch("/avatar", auth, upload.single("avatar"), async(req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" })
    const filePath = req.file.path.replace(/\\/g, "/")
    
    const updateAvatar = await User.findByIdAndUpdate(req.user.id,
        {$set: {avatar : filePath}},
        {returnDocument: true, runValidators: true}
    )

    if (!updateAvatar) return res.status(404).send("Item not found");
    res.status(200).json(updateAvatar);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})



export default router
