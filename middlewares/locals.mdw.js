import categoryModel from "../model/category.model.js";
import moment from "moment";



export default function (app) {
    
    app.use(async function (req, res, next) {
   
        if (typeof (req.session.auth) === 'undefined') {
            req.session.auth = false;

        } else if (req.session.auth !== false) {
            const account = req.session.authAccount;
           


            if (account.role === 0) {
                res.locals.Admin = false;
            } else if (account.role === 1)
                res.locals.Admin = true;

        }
       
        res.locals.auth = req.session.auth;
        res.locals.authAccount = req.session.authAccount;
       
        next();
    });



    app.use(async function (req, res, next) {
        res.locals.lcCategories = await categoryModel.findAll();
        next();
    });
}