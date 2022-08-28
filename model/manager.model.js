import knex from "knex";
import db from "../utils/db.js";

export default {
  async getMonthRevenue() {
    const sql = `select month(OrderDate) as Month,sum(Total) as DoanhThu from orders group by month(OrderDate);`;
    const raw = await db.raw(sql);
    return raw;
  },
};