import { Request, Response } from "express";
import { db } from "../../db/index";
import { productsTable, createProductSchema } from "../../db/productsSchema";
import { eq } from "drizzle-orm";
import _, { create } from "lodash";

export async function listProducts(req: Request, res: Response) {
  try {
    const products = await db.select().from(productsTable);
    res.json(products);
  } catch (e) {
    res.status(500).send(e);
  }
}
export async function getProductById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));

    if (!product) {
      res.status(404).send({ message: "Product not found" });
    } else {
      res.json(product);
    }
  } catch (e) {
    res.status(500).send(e);
  }
}
export async function createProduct(req: Request, res: Response) {
  try {
    const data = _.pick(req.body, Object.keys(createProductSchema.shape)) as {
      name: string;
      price: number;
      description?: string;
      image?: string;
    };
    const [product] = await db
      .insert(productsTable)
      .values(req.cleanBody)
      .returning();
    res.status(201).json(product);
  } catch (e) {
    res.status(500).send(e);
  }
}
export async function updateProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updatedFields = req.cleanBody;
    const [updatedProduct] = await db
      .update(productsTable)
      .set(updatedFields)
      .where(eq(productsTable.id, id))
      .returning();
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (e) {
    res.status(500).send(e);
  }
}
export async function deleteProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const [deletedProduct] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning();
    console.log("🚀 ~ deleteProduct ~ deletedProduct:", deletedProduct);
    if (!deletedProduct) {
      res.status(404).send({ message: "Product not found" });
    } else {
      res.send(204).send();
    }
  } catch (e) {
    res.status(500).send(e);
  }
}
