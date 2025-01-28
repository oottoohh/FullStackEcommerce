import express, { json, urlencoded } from "express";
import productsRoutes from "./routes/products/index.js";
import authRoutes from "./routes/auth/index.js";
import serverless from "serverless-http";
import orderRoutes from "./routes/orders/index.js";

const port = 3000;
const app = express();
app.use(urlencoded({ extended: false }));
app.use(json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/products", productsRoutes);
app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);

if (process.env.NODE_ENV === "dev") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export const handler = serverless(app);
