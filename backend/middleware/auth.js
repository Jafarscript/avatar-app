import jwt from "jsonwebtoken";


export default function auth(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({error: "No token"});

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next()
    } catch (error) {
         res.status(401).json({error: "Token is not valid"})
    }
}