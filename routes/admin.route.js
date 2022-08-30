import express from "express"
import moment from 'moment'
import multer from 'multer'
import productModel from "../model/product.model.js";
import userModel from "../model/user.model.js";
import numeral from "numeral";
import fs from 'fs';
import categoryModel from "../model/category.model.js";
import managerModel from '../model/manager.model.js'
import orderModel from '../model/order.model.js'
import sendMail from "../utils/sendMail.js";

const router = express.Router();


router.get('/updateProduct', async function (req, res) {
    const listProduct = await productModel.findByOffset(6,0);

    for (const product of listProduct) {
        product.NameCatIDNext = await categoryModel.findByCatIDNext(product.CatIDChild);
    }

    res.render('vwAdmin/manageProduct', {
        layout: 'main',
        isAdmin: true,
        isUpdateProduct: true,
        listProduct
    });
});
router.get('/Account', async function (req, res) {
    const list = await userModel.findAll();
    const listLockAccount = await userModel.findBlockAccount();

    res.render('vwAdmin/infoAccount', {
        layout: 'main',
        isUser: true,
        isEmpty: list.length === 0,
        list,
        listLockAccount
    
    });
});

router.post('/Account/lock/:email', async function (req, res) {
    const email = req.params.email;
    await userModel.lockAccount(email);
    const user = await userModel.findByEmail(email);
    const url = req.headers.referer || '/';
    res.redirect(url);
});

router.post('/Account/delete/:email', async function (req, res) {
    const email = req.params.email;
    const user = await userModel.findByEmail(email);
    await userModel.deleteAccount(email);
    const url = req.headers.referer || '/';
    res.redirect(url);
});

router.post('/Account/unlock/:username', async function (req, res) {
    const email = req.params.email;
    await userModel.unlockAccount(email);

    const user = await userModel.findByEmail(email);
    const url = req.headers.referer || '/';
    res.redirect(url);
});

router.post('/delProduct/:ProID', async function (req, res) {
    const ProID = req.params.ProID;
    await productModel.delProduct(ProID);

    const url = req.headers.referer || '/';
    res.redirect(url);
});

router.get('/Account/hasAccountLock', async function (req, res) {
    const list = await userModel.findAll();
    for (const account of list) {
        if (account.banned === 1) {
            return res.json(true);
        }
    }
    return res.json(false);
});



router.get('/loadmore', async function (req, res) {
    const offset = req.query.offset;
    const list = await productModel.findByOffset(6,(offset)*6);

    for (const product of list) {
        product.NameCatIDNext = await categoryModel.findByCatIDNext(product.CatIDChild);
    }
    res.json(list);
});


router.post('/order/confirm/:OrderID', async function (req, res) {
    const OrderID= req.params.OrderID
    await orderModel.updateState(OrderID, 'Đã duyệt')
    const url = req.headers.referer || '/';
    res.redirect(url);
});

router.get('/order', async function (req, res) {
    const list = await orderModel.getHistoryOrder('Đang chờ xác nhận');

    res.render('vwAdmin/manageOrder', {
        layout: 'main',
        isEmpty: list.length === 0,
        list,
    
    });
});


router.get('/loadmoreUser', async function (req, res) {
    const offset = req.query.offset;
    const list = await userModel.findAllUser(offset*6);

    res.json(list);
});

router.get('/updateCategory', async function (req, res) {
    const listCategory = await categoryModel.findAll();
    const listCategoryNext = await categoryModel.findCategoryNext();
    const listCategoryParent = await categoryModel.findCategoryParent();


    res.render('vwAdmin/updateCategory', {
        layout:'main.hbs',
        isAdmin: true,
        isUpdateCategory: true,
        listCategory,
        listCategoryNext,
        listCategoryParent
    });
});



  

export default router;