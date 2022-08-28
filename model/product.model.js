import db from '../utils/db.js'
import dateFormat from "../utils/dateFormat.js";
import classifyTypeSort from "../utils/classifyTypeSort.js";
import moment from "moment";



export default {
    async findTopClose(){
        const now = moment().format("YYYY-MM-DD HH:mm");
        const list = await db.select().table('products')
            .orderBy('DateEndDis')
            .whereNotNull('DateEndDis')
            .andWhere('DateEndDis', '>', now)
            .limit(5);        dateFormat({key:list});

        return list
    },
    async findTopSale(){
       
        const list = await db.select().table('products')
            .orderBy('BuyerCount', 'desc')
            .limit(5);        dateFormat({key:list});

        return list
    },
    async findTopCommended(){

        const list = await db.select().table('products')
            .orderBy('LikeCount', 'desc')
            .limit(5);
        dateFormat({key:list});

        return list
    },

    async findRelatedProducts(ProID,CatIDNext){
        let list = await db.select()
            .table('products')
            .where('CatIDNext',CatIDNext)
            .andWhereNot('ProID',ProID)
            .orderByRaw('RAND()')
            .limit(5);
        dateFormat({key:list});

        return list
    },

    async findByCatIDNext(CatIDNext){
        let list = await db.select().table('product').whereNotNull('CatID',CatIDNext);
        dateFormat({key:list});

        return list
    },
    async countByCatIDNext(CatIDNext){
        const list = await db('product').where('CatID',CatIDNext).count({amount:'ProID'});
        return list[0].amount;
    },
    async findPageByCatIDNext(CatIDNext,limit,offset){
        let list = await db.select().table('products')
            .where('CatIDNext',CatIDNext)
            .limit(limit)
            .offset(offset);

        dateFormat({key:list});

        return list
    },
    async findByProID(ProID){
        const list = await db.select().table('product').where('ProID',ProID);
        dateFormat({key:list});
        if (list.length === 0) return null;
           return list[0];
      
    },


    async findByID(ProID){
        const list = await db.select().table('products').where('ProID',ProID);
        dateFormat({key:list});

           return list;
      
    },
    async isSold(ProID){
      const list = await db('products').where('Status','like','%Hết hàng%');

      if(list.length !== 0){
          return true;
      }

      return false;
     },
    async findBySeller(username) {
        let list = await db.select().table('products').where('Seller',username);
        dateFormat({key:list});

        if (list.length === 0)
            return null;

        return list
    },
    async countProduct(){
        const count = await db('product').count('ProID',{as: 'count'});
        return count;
    },

    async addProduct(entity){
        return db('product').insert(entity);
    },

    async searchProduct(word,limit,offset){
        const sql = `SELECT *
                     FROM products
                     WHERE MATCH (ProName) AGAINST ('${word}')
                     LIMIT ${limit}
                     OFFSET ${offset}`

        const list = await db.raw(sql);
        dateFormat({key:list[0]});

        return list[0];
    },
    async searchProductBySearching(word){
        const sql = `SELECT *
                     FROM products
                     WHERE MATCH (ProName) AGAINST ('${word}')`

        const list = await db.raw(sql);
        dateFormat({key:list[0]});

        return list[0];
    },

    async searchProductByType(word,t,limit,offset){
        const type = classifyTypeSort(t);

        const sql = `SELECT *
                     FROM products
                     WHERE MATCH (ProName) AGAINST ('${word}')
                     ORDER BY ${type}
                     LIMIT ${limit}
                     OFFSET ${offset}`

        const list = await db.raw(sql);
        dateFormat({key:list[0]});

        return list[0];
    },

    async findAll(){
        const list = await db('products').select();
        dateFormat({key:list});

        return list;
    },
    async findProductEnd(){
        const now = moment().format("YYYY-MM-DD HH:mm");
        let list = await db('products').where('DateEndDis', '<', now);
        dateFormat({key:list});

        return list
    },

    async delProduct(ProID){
        await db('product').where('ProID',ProID).del();
    },


    

    async isNew(ProID,Ndays){
        const list = await db('products').where({ProID:ProID});
        dateFormat({key:list});

        const dateStart = moment(list[0].DateUpload,'DD/MM/YYYY HH:mm').format("YYYY-MM-DD HH:mm");
        const now = moment().format("YYYY-MM-DD HH:mm");

        const duration = moment(now).diff(moment(dateStart));
        const m = moment.duration(duration).asDays();

        if(+m <= Ndays){
            return true;
        }
        return false;

    },

    async findByOffset(limit,offset){
        const list = await db('product')
            .limit(limit)
            .offset(offset)
            .select();
        dateFormat({key:list});

        return list;
    },

    async findListComment(ProID) {
        const list = await db('review')
            .where({ProID:ProID}).select();

        for(let i=0;i<list.length;i++){
            list[i].time = moment(list[i].time,'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm');
            list[i].username = list[i].username;
            list[i].ProID = ProID;
            list[i].comment = list[i].comment;
        }
        return list;
    },
    addComment(entity) {
        return db('review').insert(entity);
      },

      patch(entity){
        const id=entity.ProID;
        delete entity.ProID;
        return db('products').where('ProID',id).update(entity);
      },

      async addImage(ProID, imageUrl) {
        return db('product').where('ProID',ProID).update({image: imageUrl});
    },


    async findIDProduct() {
        const ID = await db.max(`ProID`).from(`product`);
        return Object.values(ID[0])[0];
    },
    
}