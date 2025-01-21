import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization");
  if (!token) {
    res.status(401).json({ error: "Access denied" });
    return;
  }
  try {
    const decoded = jwt.verify(token, "mysecretkey");
    if (typeof decoded !== "object" || !decoded?.userId) {
      res.status(401).json({ error: "Access denied" });
      return;
    }
    req.userId = decoded.userId;
    req.role = decoded.role;
    console.log("🚀 ~ verifyToken ~ decoded:", decoded);
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
    return;
  }
}

export function verifySeller(req: Request, res: Response, next: NextFunction) {
  const role = req.role;
  if (role !== "seller") {
    res.status(401).json({ error: "You dont have access as a seller" });
    return;
  }
  next();
}
