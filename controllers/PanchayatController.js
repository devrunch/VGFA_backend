import Response from "../entities/Response.js";
import Panchayat from "../model/Panchayat.js";
import Panchayat from "../model/Panchayat.js";

export const register = async (req, res) => {
    try {
        const panchayat = new Panchayat(req.body);

        if (
            await Panchayat.findOne({
                $or: [{ email: req.body.email }, { phone: req.body.phone }],
            })
        ) {
            const err = new Error("Email or phone already registered!");
            err.status = 400;
            throw err;
        }

        await panchayat.save();

        new Response(200, "Registered Panchayat successfully!").success(res);
    } catch (error) {
        new Response(error.code || 500, error.message).error(res);
    }
};

export const login = async (req, res) => {
    try {
        const panchayat = await Panchayat.findOne({ email: req.body.email });
        if (!panchayat) {
            const err = new Error("Panchayat doesn't exist");
            err.code = 401;
            throw err;
        }

        const isMatch = await panchayat.comparePassword(req.body.password);
        if (!isMatch) {
            // Incorrect password
            const err = new Error("Invalid username or password");
            err.code = 401;
            throw err;
        }

        const token = await panchayat.generateAuthToken();
        res.cookie("jwttoken", token);
        new Response(200, "Login Success", { token }).success(res);
    } catch (error) {
        new Response(error.status || 500, error.message).error(res);
    }
};

export const update = async (req, res) => {
    try {
        const userID = res.locals.user;

        // @todo! Validate the req.body object first; Also this method returns the updated document, so the updated value can be echoed back to the user as well
        await Panchayat.findOneAndUpdate({ _id: userID }, req.body);

        new Response(200, "Updated Panchayat succcessfully!").success(res);
    } catch (error) {
        new Response(error.code || 500, error.message).error(res);
    }
};