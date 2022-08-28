// const list=[
//     { CatID: 1, CatName: 'Laptop' },
//     { CatID: 2, CatName: 'Mobile' },
//     { CatID: 3, CatName: 'Quần áo' },
//     { CatID: 4, CatName: 'Giày dép' },
//     { CatID: 5, CatName: 'Trang sức' },
//     { CatID: 6, CatName: 'Khác' }
// ];
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
async findByCatIDNext(CatID) {

  if (CatID === null)
      return null;

  const Cat = await db('category').where({'CatID': CatID})
  return Cat[0].CatName;
},
addCategory(category){
  return db('category').insert(category);
},

async findCategoryNextID() {
  const id = await db('category').count('CatID as amount');
  return id[0].amount + 1;
},


addSubCategory(subCategory) {
  return db('category').insert(subCategory);
},

}
