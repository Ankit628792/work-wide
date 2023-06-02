import jwtDecode from "jwt-decode"
import * as jwt from 'jsonwebtoken'

export const decodeToken = (token) => {
    let data = jwtDecode(token)
    // let data = jwt.verify(token, process.env.TOKEN_KEY);
    return data
}

export const generateToken = (data) => {
    const token = jwt.sign(
        data,
        process.env.TOKEN_KEY,
        {
            expiresIn: "20h",
        }
    );
    return token
}