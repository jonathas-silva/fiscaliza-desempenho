import { infoOS } from "../types/tipos";

export function inserirInfos(informacoes: infoOS) {

    let info: infoOS[] = new Array;
    if (localStorage.hasOwnProperty("info")) {
        info = JSON.parse(localStorage.getItem("info") || "");
    }


    const indice: number = localizarIndice(informacoes.linha);


    //se não tiver dá um push
    if (indice == -1) {
        info.push(informacoes);
    } else {
        info.splice(indice, 1, informacoes)
    }

    localStorage.setItem("info", JSON.stringify(info));
}



//função que busca o index da info no array pela linha

export function localizarIndice(linha: number) {
    //cria o array de infos
    let info: infoOS[] = new Array;
    if (localStorage.hasOwnProperty("info")) {
        info = JSON.parse(localStorage.getItem("info") || "");
    }

    const index = info.map(obj => obj.linha).indexOf(linha);

    return index;
}

export function recuperarEntrada(linha:number){

    let info: infoOS[] = new Array;
    if (localStorage.hasOwnProperty("info")) {
        info = JSON.parse(localStorage.getItem("info") || "");
    }

    return info.find(element => element.linha == linha);
    
}