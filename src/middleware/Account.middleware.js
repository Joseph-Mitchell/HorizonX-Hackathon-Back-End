import jwt from "jsonwebtoken";
import AccountService from "../services/Account.service.js";

export default class AccountMiddleware {
    accountService = new AccountService();
    
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