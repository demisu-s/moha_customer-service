import { PERMISSIONS } from "../constants/permissions";

export const authorize = (permission: keyof typeof PERMISSIONS) => {
  return (req: any, res: any, next: any) => {
    if (!PERMISSIONS[permission].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
