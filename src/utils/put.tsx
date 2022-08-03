import { linha, resultado, viagem } from "../types/tipos";

export function localizarResultados(): resultado[] {

    let resultadoLista: resultado[] = new Array;
    if (localStorage.hasOwnProperty("resultado")) {
        resultadoLista = JSON.parse(localStorage.getItem("resultado") || "");
    }

    return resultadoLista;
}

export function put(resultados: resultado) {

    //primeiro a gente pega o objeto que está no localStorage
    let resultadoLista: resultado[] = localizarResultados();

    resultadoLista.push(resultados);


    localStorage.setItem("resultado", JSON.stringify(resultadoLista));



}

export function relatorio():linha[] {
    let resultados: resultado[] = localizarResultados();
    let linhas: (string | number)[] = [];
    let linhasResultado: linha[] = [];

    //Criando um array com todas as linhas

    resultados.forEach(
        x => {
            if (linhas.includes(x.linha)) {
            } else {
                linhas.push(x.linha);
            }
        }
    )

    localStorage.setItem("linhas", JSON.stringify(linhas));


    linhas.forEach(linha => 
            {

                let filtrado = resultados.filter(x => (x.linha == linha));
                let viagens: viagem[] = [];
                filtrado.forEach(
                    x => {
                        let viagem: viagem = {
                            prefixo: parseInt(x.prefixo),
                            horario: x.horario
                        }
                        viagens.push(viagem);
                    }
                )
                
                //ordenando as viagens por horário
                viagens.sort((a,b) => a.horario > b.horario? 1: -1);

                linhasResultado.push({
                    linha: parseInt(linha.toString()),
                    viagens: viagens
                })
                    }
                
                )
                //ordenando por ordem crescente de linha. Pra fazer graça
                linhasResultado.sort((a,b) => a.linha > b.linha? 1: -1);

                //console.log(JSON.stringify(linhasResultado));


                return linhasResultado;
                
                


                //navigator.clipboard.writeText(JSON.stringify(linhasResultado));
                //navigator.clipboard.writeText(tabela); //Função que atualiza 
            }




