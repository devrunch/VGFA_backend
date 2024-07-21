import User from "../model/Farmer.js";
import Official from "../model/Official.js";
import { verifyJwtToken } from "../utils/tokenUtil.js";

import Response from "../entities/Response.js";

export const farmerAuthCheck = async (req, res, next) => {
    try {
        const header = req.headers.authorization
        if (!header) {
            let err = new Error("Token not found in header");
            err.status = 402;
            throw err;
        }
        const token = header.split("Bearer ")[1]
        if (!token) {
            let err = new Error("Token not found in header");
            err.status = 402;
            throw err;
        }
        const userId = verifyJwtToken(token)
        if (!userId) {
            let err = new Error("JWT token not valid");
            err.status = 401;
            throw err;
        }
        const user = await User.findById(userId)
        if (!user) {
            let err = new Error("User Not Found");
            err.status = 400;
            throw err;
        }
        res.locals.user = user
        next()
    } catch (err) {
        new Response(err.status || 500, err.message).error(res);
    }
}
export const officialAuthCheck = async (req, res, next) => {
    try {
        const header = req.headers.authorization
        if (!header) {
            next(JSON.stringify({ status: 401, message: "header missing" }))
            return
        }
        const token = header.split("Bearer ")[1]
        if (!token) {
            next({ status: 401, message: "AUTH_TOKEN_MISSING_ERR" })
            return
        }
        const user = await Official.findByToken(token)
        if (!user) {
            next({ status: 401, message: "USER_NOT_FOUND_ERR" })
            return
        }
        res.locals.user = user
        next()
    } catch (err) {
        new Response(401, err.message).error(res);
    }
}
