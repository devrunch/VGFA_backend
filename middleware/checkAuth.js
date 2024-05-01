import User from "../model/Farmer.js";
import Official from "../model/Official.js";
import { verifyJwtToken } from "../utils/tokenUtil.js";

export const farmerAuthCheck = async (req, res, next) => {
    try {
        const header = req.headers.authorization
        if (!header) {
            next({ status: 403, message: "header missing" })
            return
        }
        const token = header.split("Bearer ")[1]
        if (!token) {
            next({ status: 403, message: "AUTH_TOKEN_MISSING_ERR" })
            return
        }
        const userId = verifyJwtToken(token, next)
        if (!userId) {
            next({ status: 403, message: "JWT_DECODE_ERR" })
            return
        }
        const user = await User.findById(userId)
        if (!user) {
            next({ status: 404, message: "USER_NOT_FOUND_ERR" })
            return
        }
        res.locals.user = user
        next()
    } catch (err) {
        res.status(401).json({
            type: "error",
            message: err.message,
        });
    }
}
export const officialAuthCheck = async (req, res, next) => {
    try {
        const header = req.headers.authorization
        if (!header) {
            next({ status: 403, message: "header missing" })
            return
        }
        console.log("header\n")
        const token = header.split("Bearer ")[1]
        if (!token) {
            next({ status: 403, message: "AUTH_TOKEN_MISSING_ERR" })
            return
        }
        console.log("Token\n")
        const user = await Official.findByToken(token)
        if (!user) {
            next({ status: 404, message: "USER_NOT_FOUND_ERR" })
            return
        }
        res.locals.user = user
        next()
    } catch (err) {
        res.status(401).json({
            type: "error",
            message: err.message,
        });
    }
}
