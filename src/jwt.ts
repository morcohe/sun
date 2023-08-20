var jwt = require('jsonwebtoken');

/**
     * @description jwt sign object. expiration setted to 1 hour.
     * @param data object to sign.
     * @returns {string} JWT token as promise.
     */
export const sign = (payload: object) => {
    return jwt.sign(payload, process.env.SECRET, { expiresIn: "1h" });
}




/**
 * 
 * @param jwtToken string
 * @returns extracted jwt data
 */
export const extract = (token: string) => {
    //console.log("\n\n[JWT EXTRACT] - TOKEN TO EXTRACT: ", token)
    try {
        const payload = jwt.verify(token, process.env.SECRET);
        //console.log("JWT VERIFY: ", payload);
        return {
            data: payload,
            expired: false
        };
    } catch (err) {
        //console.log("JWT VERIFY - ERROR: ", err);
        return {
            data: {},
            expired: err.message.includes("jwt expired")
        };
    }
}