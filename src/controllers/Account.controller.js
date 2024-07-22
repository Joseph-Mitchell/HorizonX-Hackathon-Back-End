import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default class AccountController {
    #accountService;
    
    constructor(accountService) {
        this.#accountService = accountService;
    }
    
    // try {
        
    // } catch (e) {
    //     console.log(e.message);
    //     return res.status(500).json({ message: e.message });
    // }
    
    async login(req, res) {
        try {
            const response = await this.#accountService.getAccountByUsername(req.body.username);
            
            if (response === null || !bcrypt.compareSync(req.body.password, response.password))
                return res.status(404).json({ message: "Incorrect username or password" });
            
            const signedToken = jwt.sign({ id: response._id.toString() }, process.env.SECRET, { expiresIn: "1 week" });
            return res.status(200).json({ token: signedToken });
        } catch (e) {
            console.log(e.message);
            return res.status(500).json({ message: e.message });
        }
    }
}