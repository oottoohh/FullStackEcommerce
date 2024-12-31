import { Request, Response } from "express";

export function listProducts(req: Request, res: Response) {
  res.send("the list of Products");
}
export function getProductById(req: Request, res: Response) {
  res.send("get a Product by id");
}
export function createProduct(req: Request, res: Response) {
  res.send("create a new Product");
}
export function updateProduct(req: Request, res: Response) {
  res.send("update a Product");
}
export function deleteProduct(req: Request, res: Response) {
  res.send("delete a Product");
}
