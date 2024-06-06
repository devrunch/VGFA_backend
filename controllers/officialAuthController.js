import User from '../model/Official.js';
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
    res.json({ message: "Login Success", status: 1 ,token: token })
  }catch(err){
    res.status(err.status || 500).json({ message: err.message });
  }
  }
export const Profile = async (req, res) => {
  try{
    const user = res.locals.user; 
    res.json({ message: user, status: 1 })
  }
  catch(err){
   res.status(401).json({ message: "Unauthorized", status: 401 });
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
      res.status(200).json({ message: "User created successfully", status: 1 })
    } catch (error) {
      console.log(error)
      res.status(error.status || 500).json({ message: error.message, status: 0 })
    }
  }