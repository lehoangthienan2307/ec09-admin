import { engine } from 'express-handlebars';
import numeral from 'numeral';
import hbs_sections from "express-handlebars-sections";
import moment from "moment";

export default function (app) {
    app.engine('hbs', engine({
        extname:'.hbs',
        defaultLayout: 'main.hbs',
        helpers: {
          format_number(val){
            return numeral(val).format('0,0');
          },
          format_date(date){
            return moment(date,'YYYY-MM-DD').format('DD/MM/YYYY');
        },
        mask_username(username){
          let result = "****";

          if(username === null)
              return "";
          else{
              return username.substring(0,username.length/2) + result;
          }
      },
          
          section: hbs_sections()
        }
      }));
      app.set('view engine', 'hbs');
      app.set('views', './views');
}