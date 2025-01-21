import { Router } from "express";
import {
  createUserSchema,
  loginSchema,
  usersTable,
} from "../../db/usersSchema";
import { validateData } from "../../middlewares/validationMiddleware";
import bcrypt from "bcryptjs";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", validateData(createUserSchema), async (req, res) => {
  try {
    const data = req.cleanBody;
    data.password = await bcrypt.hash(data.password, 10);
    const user: { id: number; role: string; password?: string | undefined }[] =
      await db.insert(usersTable).values(data).returning();
    if (user[0].password) {
      delete user[0].password;
    }

    res
      .status(201)
      .json({ user: user[0], message: "User created successfully" });
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

router.post("/login", validateData(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.cleanBody;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user || !user.password || user.email !== email) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      "mysecretkey",
      { expiresIn: "30d" }
    );

    // @ts-ignore
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

export default router;
