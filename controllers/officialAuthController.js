
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
    res.cookie('jwttoken', token);  
    new Response(200, "Login Success", { token }).success(res);
  }catch(error){
    new Response(error.status || 500, error.message).error(res);
  }
};
export const Profile = async (req, res) => {
  try{
    const user = res.locals.user; 
    res.json({ message: user, status: 1 })
  }
  catch(error){
    new Response(error.status || 500, error.message).error(res);

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
      new Response(200, "User created successfully!").success(res);
    } catch (error) {
      console.log(error)
      new Response(error.status || 500, error.message).error(res);
    }
  }