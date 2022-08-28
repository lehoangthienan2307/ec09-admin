import db from '../utils/db.js';

export default {
  findAll() {
    return db('orders');
  },

  async findById(id) {
    const list = await db('orders').where('OrderID', id);
    if (list.length === 0)
      return null;

    return list[0];
  },

  add(entity) {
    return db('orders').insert(entity);
  },

  del(id) {
    return db('orders')
      .where('OrderID', id)
      .del();
  },

  patch(entity) {
    const id = entity.OrderID;
    delete entity.OrderID;

    return db('orders')
      .where('OrderID', id)
      .update(entity);
  },
  async getLatestOrder() {
    const sql =
      "SELECT * FROM orders WHERE OrderID=(SELECT MAX(OrderID) FROM orders);";
    const raw = await db.raw(sql);
    return raw[0];
  },
  getOrderHistory(userId) {
    return db("orders")
      .where("orders.UserID", userId)
      .select("orders.OrderID", "orders.OrderDate", "orders.Total");
  }
}
