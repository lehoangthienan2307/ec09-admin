export default function (url){
    const list = url.split('/');
    let resultUrl = '/';
    for(let i=3;i<list.length;i++){
        if(list[i] !== '')
            resultUrl += list[i]+'/';
    }

    return resultUrl;
}