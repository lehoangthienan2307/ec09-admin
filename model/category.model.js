
import db from '../utils/db.js';
import productModel from "../model/product.model.js";



export default {
  async findAll() {
    const list = await db.select().table('category');
    return list;
},

async findCategoryNext() {
    const listsub = await db('category').select().whereNotNull('parentId');
    return listsub;
},



async findCategoryParent() {
  const list= await db.select().table('category').whereNull('parentId');
  return list;
},


}
