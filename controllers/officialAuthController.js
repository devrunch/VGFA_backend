import User from '../model/Official.js';

import Response from '../entities/Response.js';

export const Login = async (req, res) => {
  try{

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      
      let err = new Error("User Doesen't Exist");
      err.status = 401;
      throw err;
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      // Incorrect password
      let err = new Error('Invalid username or password');
      err.status = 401;
      throw err;
    }
    
    const token = await user.generateAuthToken();
    res.cookie('jwttoken', token);  
    new Response(200, "Login Success", { token }).success(res);
  }catch(error){
    new Response(error.status || 500, error.message).error(res);
  }
  }
export const Profile = async (req, res) => {
  try{
    const user = res.locals.user; 
    res.json({ message: user, status: 1 })
  }
  catch(error){
    new Response(error.status || 500, error.message).error(res);
  }
}
export const Register = async (req, res) => {
  try {
    const user = new User(req.body);
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
      let err = new Error("Email already exists");
      err.status = 400;
      throw err;
    }
      await user.save();
      new Response(200, "User created successfully!").success(res);
    } catch (error) {
      console.log(error)
      new Response(error.status || 500, error.message).error(res);
    }
  }