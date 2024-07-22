import jwt from "jsonwebtoken";

export default class AccountMiddleware {
    static authenticateToken = (req, res, next) => {
        let token = req.headers["authentication"];
        
        if (!token) {
            return res.status(401).send({ message: "No token provided" });
        }
        
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err)
                return res.status(401).send({ message: "Token not recognized" });
            
            req.body.id = decoded.id;
            next();
        });
    };
}