import db from '../utils/db.js';

export default {
  findAll() {
    return db('orders');
  },

  async getHistoryOrder(orderState) {
      
    const result = await db('orders')
    .join('orderstatus','orderstatus.OrderID','orders.OrderID')
    .join('payment', 'orders.PaymentID', 'payment.PaymentID')
    .where({'orderstatus.Status': orderState})
    .select(
        'orders.OrderID',
        "orders.email", 
        "orders.OrderDate",
        "orderstatus.Status",
        "payment.method",
        "orders.address",
        "orders.province",
        "orders.district",
        "orders.ward",
        "orders.Total",
        "orders.ShipPrice",
        "orders.OrderPrice",
       
    )
    .orderBy('orderstatus.time', 'desc')
    return result || null;
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

  async updateState(orderId, orderState) {
    await db('orderstatus')
    .where('OrderID', orderId)
    .update({
        Status: orderState
    })
   
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
