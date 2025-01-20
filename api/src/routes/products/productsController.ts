import { Request, Response } from "express";
import { db } from "../../db/index";
import { productsTable } from "../../db/productsSchema";

export function listProducts(req: Request, res: Response) {
  res.send("the list of Products");
}
export function getProductById(req: Request, res: Response) {
  res.send("get a Product by id");
}
export async function createProduct(req: Request, res: Response) {
  const [product] = await db.insert(productsTable).values(req.body).returning();
  res.status(201).json(product);
}
export function updateProduct(req: Request, res: Response) {
  res.send("update a Product");
}
export function deleteProduct(req: Request, res: Response) {
  res.send("delete a Product");
}
