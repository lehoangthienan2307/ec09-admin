import moment from "moment";

export default function (list){

    for(let i=0;i<list.key.length;i++){
        list.key[i].DateEndDis = moment(list.key[i].DateEndDis,'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm');
        
    }

}