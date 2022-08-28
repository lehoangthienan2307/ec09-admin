import db from '../utils/db.js'
import moment from "moment";

export default {
    addAccount(account) {
        return db('users').insert(account);
    },
    updateInfoAccount(info) {
        const email = info.email;
        delete info.email;
        return db('user').where('email', email).update(info);
    },
    async findAll(){
        return db('user').where({role: 0});
    },
    async findBlockAccount(){
        return db('user').where({role: 0, banned:1});
    },
    async findByEmail(email) {
        const list = await db('user').where('email', email);

        if (list.length === 0)
            return null;

        return list[0];
    },


    async findAll(){
        return db('user');
    },

    async degradeAccount(username){
        await db('users')
            .where({ username: username})
            .update({ level: 'bidder' });
        await db('upgrade')
            .where({ id: username})
            .update({ isCancel: 1 })
    },

    
    async getNameByUsername(username){
        const obj = await db('users').where('username',username).select('name');
        return obj[0].name;
    },

    
    async lockAccount(email) {
        await db('user')
            .where({ email: email})
            .update({ banned: 1 })
    },
    async unlockAccount(email) {
        await db('user')
            .where({ email: email})
            .update({ banned: 0 })
    },
    async deleteAccount(email) {
        await db('user')
            .where({email: email})
            .delete()
    },

    async findAllUser(offset){
        const list = await db('user')
            .where({role: "user",banned:false})
            .limit(6)
            .offset(offset)
            .select();

        return list;
    },

}