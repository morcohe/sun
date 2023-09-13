const bcrypt = require("bcrypt")

const SALT = "$2b$10$t7oxiwchWGHa/B9w0AzrYO";

export const hashPassword = async (password: string) => {
    try {
        const hash = await bcrypt.hash(password, SALT);
        return hash;
    } catch (error) {
        throw new Error(`Hash process failed: ${error.message}`);
    }
}


export const validateUser = async (hash: string, password: string) => {
    try {
        const isValid = await bcrypt.compare(password, hash);
        return isValid;
    } catch (error) {
        throw new Error(`User validation failed: ${error.message}`);
    }
}

