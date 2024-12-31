import { Router } from "express";

// Products endpoints
const router = Router();

router.get("/", (req, res) => {
  res.send("the list of Products");
});

router.get("/:id", (req, res) => {
  console.log("🚀 ~ app.get ~ req:", req);
  res.send("A Products");
});

router.post("/", (req, res) => {
  res.send("New Product created");
});

export default router;
