import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));


import authRoute from "../routes/auth.route.js";
import adminRoute from "../routes/admin.route.js";
import {authAdmin} from './auth.mdw.js';
import uploadRoute from '../routes/upload.route.js'

export default function (app) {
 
  app.get('/terms', async function (req,res){
    res.render('terms',{
        layout:'main.hbs'
    });
});
  
  app.get('/err', function (req, res) {
    throw new Error('Error!');
  });


 

  app.use('/', authRoute)
  app.use('/admin', authAdmin, adminRoute);
  app.use('/admin/upload',uploadRoute)
  app.use(function (req, res, next) {
    res.render('404', { layout: false });
  });

  app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.render('500', { layout: false });
  });
}




