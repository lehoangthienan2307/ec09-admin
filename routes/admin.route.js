import express from "express"
import moment from 'moment'
import multer from 'multer'
import productModel from "../model/product.model.js";
import userModel from "../model/user.model.js";
import numeral from "numeral";
import fs from 'fs';
import categoryModel from "../model/category.model.js";
import managerModel from '../model/manager.model.js'
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
    const content = 'Tài khoản ' + user.email + ' của bạn đã bị khóa. Bạn sẽ không thể đăng nhập vào hệ thống. ' +
        'Vui lòng liên hệ lại chúng tôi đễ biết thêm chi tiết';
    sendMail(user.email, content);

    const url = req.headers.referer || '/';
    res.redirect(url);
});

router.post('/Account/delete/:email', async function (req, res) {
    const email = req.params.email;
    const user = await userModel.findByEmail(email);
    
    const content = 'Tài khoản #' + user.email + ' của bạn đã bị xóa khỏi hệ thống. Bạn sẽ không thể đăng nhập vào hệ thống. ' +
        'Vui lòng liên hệ lại chúng tôi đễ biết thêm chi tiết';
    sendMail(user.email, content);
    await userModel.deleteAccount(email);

    const url = req.headers.referer || '/';
    res.redirect(url);
});

router.post('/Account/unlock/:username', async function (req, res) {
    const email = req.params.email;
    await userModel.unlockAccount(email);

    const user = await userModel.findByEmail(email);
    const content = 'Tài khoản #' + user.email + ' của bạn đã được mở khóa. Bạn đã có thể đăng nhập vào hệ thống. ' +
        'Cảm ơn bạn đã sử dụng hệ thống của chúng tôi.';
    sendMail(user.email, content);

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



router.get('/loadmoreUser', async function (req, res) {
    const offset = req.query.offset;
    const list = await userModel.findAllUser(offset*6);

    res.json(list);
});

router.get("/statistics/revenue", async function (req, res) {
    res.render("vwAdmin/statistics");
  });
  router.get("/statistics/revenue", async function (req, res) {
    let list = await managerModel.getMonthRevenue();
    res.json(list[0]);
  });
  

export default router;