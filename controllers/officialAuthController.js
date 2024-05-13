import User from '../model/Official.js';
export const Login = async (req, res) => {
  try{

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      
      let err = new Error("User Doesen't Exist");
      err.status = 401;
      throw err;
    }
    // console.log(user)
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      // Incorrect password
      let err = new Error('Invalid username or passwordd');
      err.status = 401;
      throw err;
    }
    
    const token = await user.generateAuthToken();
    console.log(token)
    res.cookie('jwttoken', token);  
    res.json({ message: "Login Success", status: 1 ,token: token })
  }catch(err){
    res.status(error.status || 500).json({ message: error.message });
  }
  }
export const Profile = async (req, res) => {
  try{
    console.log("i")
    const user = res.locals.user; 
    res.json({ message: user, status: 1 })
  }
  catch(err){
   res.status(400).json({ message: "Unauthorized", status: 401 });
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
      const token = user.generateAuthToken();
      res.cookie('token', token, { httpOnly: true, sameSite: 'strict', secure: false }); 
      res.json({ message: "User created successfully", status: 1 })
    } catch (error) {
      console.log(error)
      res.status(error.status || 500).json({ message: error.message, status: 0 })
    }
  }