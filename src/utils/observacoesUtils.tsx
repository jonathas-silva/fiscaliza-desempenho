export function salvarObservacoes(obs: string) {

    localStorage.setItem("observacoes", obs);

}

export function recuperarObservacoes(): string {

    let retorno: string = "";

    if (localStorage.hasOwnProperty("observacoes")) {
        retorno = localStorage.getItem("observacoes") || "";
    }

    return retorno;
}

export function limparObservacoes() {
    if (localStorage.hasOwnProperty("observacoes")) {
        localStorage.removeItem("observacoes");
    }
}