import User from '../model/Official.js';
export const Login = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // Username not found
      return res.status(401).json({ message: 'Invalid user' });
    }
    // console.log(user)
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      // Incorrect password
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  
    const token = await user.generateAuthToken();
    console.log(token)
    res.cookie('jwttoken', token);  
    res.json({ message: "Login Success", status: 1 ,token: token })
  }
export const Profile = async (req, res) => {
  try{
    console.log("i")
    const user = res.locals.user; 
    res.json({ message: user, status: 1 })
  }
  catch(err){
    console.log(err.message)
   res.status(500).json({ message: "Unauthorized", status: 401 });
  }
}
export const Register = async (req, res) => {
    console.log(req.body)
    const user = new User(req.body);
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
      console.log('exist')
      return res.status(400).json({ message: 'Email already exists', status: 0 });
    }
    try {
      await user.save();
      const token = user.generateAuthToken();
      res.cookie('token', token, { httpOnly: true, sameSite: 'strict', secure: false }); // secure true to allow https only
      res.json({ message: "User created successfully", status: 1 })
    } catch (error) {
      console.log(error)
      res.status(400).json({ message: error.message, status: 0 })
    }
  }