import User from "../model/Official.js";
import Response from "../entities/Response.js";
export const Login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(401)
        .json(new Response(401, "User Doesn't exist", null));
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      // Incorrect password
      return res
        .status(401)
        .json(new Response(401, "Invalid username or password", null));
    }

    const token = await user.generateAuthToken();
    res.cookie("jwttoken", token);
    res
      .status(200)
      .json(new Response(200, "Login Success", { status: 1, token }));
  } catch (err) {
    res
      .status(err.status || 500)
      .json(new Response(err.status || 500, err.message, null));
  }
};
export const Profile = async (req, res) => {
  try {
    const user = res.locals.user;
    res.json({ message: user, status: 1 });
  } catch (err) {
    res.status(401).json({ message: "Unauthorized", status: 401 });
  }
};
export const Register = async (req, res) => {
  try {
    const user = new User(req.body);
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
      return res
        .status(400)
        .json(new Response(400, "Email already exists", null));
    }
    await user.save();
    res
      .status(200)
      .json(new Response(200, "User created successfully", { status: 1 }));
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json(new Response(error.status || 500, error.message, { status: 0 }));
  }
};
