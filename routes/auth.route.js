import express from "express";
import bcrypt from 'bcrypt';
import userModel from "../model/user.model.js";
import moment from "moment";
import sendMail from "../utils/sendMail.js";
import generateOtp from "../utils/generateOTP.js";
import sliceURL from "../utils/sliceURL.js";
import numeral from "numeral";

// import {activeEmail} from '../middlewares/auth.mdw.js';

const router = express.Router();


router.get('/', async function (req, res) {
    res.render('auth/login', {
        layout: 'auth'
    });
});

router.post('/', async function (req, res) {
    const account = await userModel.findByEmail(req.body.email);

    if (account.role === 0) {
        return res.render('auth/login', {
            layout: 'auth',
            errMessage: "Tài khoản hoặc mật khẩu sai",
        });
    }
    const ret = bcrypt.compareSync(req.body.password, account.password);
    if (ret === false) {
        return res.render('auth/login', {
            layout: 'auth',
            errMessage: "Tài khoản hoặc mật khẩu sai",
        });
    }

    delete account.password;

    req.session.auth = true;
    req.session.authAccount = account;

   
    let url =  '/admin/updateProduct';

    res.redirect(url);
});

router.post('/logout', async function (req, res) {

    req.session.auth = false;
    req.session.authAccount = null;
    res.redirect('/');
});


export default router