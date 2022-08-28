import express from "express";
import { v2 as cloudinary } from 'cloudinary'
import {authAdmin} from '../middlewares/auth.mdw.js'
import * as fs from 'fs';
import config from "../config/constants.js";
import categoryModel from "../model/category.model.js";
import productModel from "../model/product.model.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import multer from 'multer';
import fsExtra from 'fs-extra';
import bodyParser from "body-parser";


const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({extended: false}))

let numberOfImage = 0;


cloudinary.config({
    cloud_name: "science-university",
    api_key: "741421319955868",
    api_secret: "5o_R3axYqAtmPKpqYqk-8wB6yY8"
});



const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: `huimitu/product`,
        allowedFormats: ['jpg', 'png'],
    },
});

const upload = multer({ storage: storage });




router.get('/',async function (req,res){
    const listCategoryNext = await categoryModel.findCategoryNext();
    res.render('vwAdmin/uploadProduct',{
        layout:'auth',
        isUpload: true,
        listCategoryNext
    });
});

router.post('/',async function (req, res) {
    try {
        const {ProName, Price, Description, CatIDChild} = req.body;
    
        const newProduct = {
            ProName, Price, Description, CatIDChild
        }

        await productModel.addProduct(newProduct)
        res.redirect('/admin/upload/image');
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})
// Validate number of pictures
async function validUploadLength(req, res, next) {
   
    let errorImages = false;


    // Validate images
    if (req.files.length > 1) {
        numberOfImage = 0;
        errorImages = true;
    }


    // Error -> render
    if ( errorImages ) {
        res.render('vwAdmin/uploadImage',{
            layout: 'main',
            errorImages,
           
        });
        return;
    }

     next()
}


router.get('/image', async (req, res) => {
    let pActive = true;


    res.render('vwAdmin/uploadImage',{
        pActive,
        layout: 'main'
    });
});


router.post('/image', urlencodedParser, [upload.array('img',1), validUploadLength], async function(req, res) {
    let pActive = true;
    const ID =  await productModel.findIDProduct();
    let imageURLList = [];
  
    for (let i = 0; i < req.files.length; i++) {
        let url = req.files[i].path;
        imageURLList.push(url);
    }





    for (let i = 0; i < imageURLList.length; i++) {
        
            const imageURL= imageURLList[i]
       
        await productModel.addImage(ID, imageURL);
    }




    res.render('vwAdmin/uploadImage',{
        pActive,
        layout: 'main',
        congratulations: true
    });
    res.redirect('/admin/upload');
});



export default router;