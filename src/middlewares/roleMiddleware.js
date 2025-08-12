export function roleMiddleware(...rolesPermitidos) {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ error: "No tienes permisos" });
    }
    next();
  };
}
