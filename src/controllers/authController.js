import jwt from "jsonwebtoken";

export function generateToken(user) {
  const payload = {
    user_id: user.user_id,
    role: user.role,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "2h", // El token expira en 2 horas
  });
}
