import User from "../models/User.js";
import generateId from "../helpers/generateId.js";
import generateJWT from "../helpers/generateJWT.js";

const register = async (req, res) => {
  // Avoid duplicated registers
  const { email } = req.body;

  const isUserExisted = await User.findOne({ email });

  if (isUserExisted) {
    const error = new Error("User already registered");
    return res.status(400).json({ msg: error.message });
  }

  try {
    // create new object type user
    const user = new User(req.body);
    user.token = generateId();
    await user.save();
    res.json({msg: "User created correctly"});
  } catch (error) {
    console.log(error);
  }
};

const auth = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("User does not exist");
    return res.status(404).json({ msg: error.message });
  }

  if (!user.success) {
    const error = new Error("Your account has not been confirmed yet");
    return res.status(403).json({ msg: error.message });
  }

  if (await user.checkPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateJWT(user._id),
    });
  } else {
    const error = new Error("Incorrect Password");
    return res.status(403).json({ msg: error.message });
  }
};

const verification = async (req, res) => {
  // token from url
  const { token } = req.params;

  const userVerification = await User.findOne({ token });

  if (!userVerification) {
    const error = new Error("Invalid token");
    return res.status(403).json({ msg: error.message });
  }
  try {
    userVerification.success = true;
    // single-use token
    userVerification.token = "";
    // save in database
    await userVerification.save();

    res.json({ msg: "User Successfully Confirmed" });
  } catch (error) {
    console.log(error);
  }
};

const recoverPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("User does not exist");
    return res.status(404).json({ msg: error.message });
  }

  try {
    user.token = generateId();
    await user.save();

    res.json({ msg: "We have sent an email with instructions" });
  } catch (error) {
    console.log(error);
  }
};

const checkToken = async (req, res) => {
  const { token } = req.body;

  const validToken = await User.findOne({ token });

  if (validToken) {
    res.json({ msg: "Valid token, user alredy exist!" });
  } else {
    const error = new Error("Invalid token");
    return res.status(404).json({ msg: error.message });
  }
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const user = await User.findOne({ token });

  if(user){
    // Re write password and change for new password
    user.password = password;
    user.token = "";

    try{
        await user.save();
        res.json({ msg: "Password correctly modified"})
    }catch(error){
        console.log(error)
    }
  }else{
    const error = new Error("Invalid token");
    return res.status(404).json({ msg: error.message });
  }
};

const profile = async (req, res) => {
    const { user } = await req;
    res.json(user);
}

export {
  register,
  auth,
  verification,
  recoverPassword,
  checkToken,
  newPassword,
  profile
};