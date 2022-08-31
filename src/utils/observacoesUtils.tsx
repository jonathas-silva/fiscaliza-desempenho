export function salvarObservacoes(obs:string){

    localStorage.setItem("observacoes", obs);

}

export function recuperarObservacoes(): string{

    let retorno:string = "";

    if (localStorage.hasOwnProperty("observacoes")) {
        retorno = localStorage.getItem("observacoes") || "";
    }

    return retorno;
}