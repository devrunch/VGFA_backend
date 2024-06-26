import jwt from "jsonwebtoken";

export const createJwtToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2 days" });
  return token;
};

export const verifyJwtToken = (token) => {
    try {
      const  {userId}  = jwt.verify(token, process.env.JWT_SECRET);
      return userId
      
    } catch (error) {
      return null;
    }
};
