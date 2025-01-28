import { Request, Response } from "express";
import { db } from "../../db/index.js";
import { orderItemsTable, ordersTable } from "../../db/ordersSchema.js";
import { eq } from "drizzle-orm";

export async function createOrder(req: Request, res: Response) {
  try {
    const { order, items } = req.cleanBody;

    const userId = req.userId;
    if (!userId) {
      res.status(400).json({ error: "Invalid order data" });
    }
    const [newOrder] = await db
      .insert(ordersTable)
      .values({ userId: userId, ...req.cleanBody })
      .returning();
    //TODO: validate products ids, and take their actual price from the database
    const orderItems = items.map((item: any) => ({
      ...item,
      orderId: newOrder.id,
    }));
    const newOrderItem = await db
      .insert(orderItemsTable)
      .values(orderItems)
      .returning();
    res.status(201).json({ ...newOrder, items: newOrderItem });
  } catch (e) {
    res.status(400).json({ error: "Invalid order data" });
  }
}

// if role is admin, return all orders
// if role is seller, return orders by sellerId
// else, return only orders filtered by req.userId
export async function listOrders(req: Request, res: Response) {
  try {
    const orders = await db.select().from(ordersTable);
    res.json(orders);
  } catch (e) {
    res.status(500).send(e);
  }
}

export async function getOrder(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const orderWithItems = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, id))
      .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId));

    if (orderWithItems.length === 0) {
      res.status(404).send({ message: "Order not found" });
    }
    const mergedOrder = {
      ...orderWithItems[0].orders,
      items: orderWithItems.map((oi) => oi.order_items),
    };
    res.status(200).json(mergedOrder);
  } catch (e) {
    res.status(500).send(e);
  }
}

export async function updateOrder(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updatedFields = req.cleanBody;
    const [updatedOrder] = await db
      .update(ordersTable)
      .set(updatedFields)
      .where(eq(ordersTable.id, id))
      .returning();
    if (updatedOrder) {
      res.json(updatedOrder);
    } else {
      res.status(404).send({ message: "Order not found" });
    }
  } catch (e) {
    res.status(500).send(e);
  }
}
