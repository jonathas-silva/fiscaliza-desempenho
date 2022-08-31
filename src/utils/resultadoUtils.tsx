import {fiscalizacao, linha, resultado, viagem} from "../types/tipos";
import {initializeApp} from "firebase/app";
import {addDoc, collection, Firestore, getDocs, getFirestore} from "firebase/firestore";
import {useEffect, useState} from "react";
import firebase from "firebase/compat";

export function localizarResultados(): resultado[] {

    let resultadoLista: resultado[] = new Array;
    if (localStorage.hasOwnProperty("resultado")) {
        resultadoLista = JSON.parse(localStorage.getItem("resultado") || "");
    }

    return resultadoLista;
}

export function salvarNuvem(dados: fiscalizacao) {

    const firebaseApp = initializeApp({
        apiKey: "AIzaSyCrkZLQyEtBVgH64abl_B2KBwJ-oQU8st8",
        authDomain: "fiscaliza-desempenho.firebaseapp.com",
        projectId: "fiscaliza-desempenho",
    });

    const db = getFirestore(firebaseApp);


    async function putFiscalizacao(data: fiscalizacao) {
        addDoc(collection(db, "/fiscalizacoes"), data);
    }


    putFiscalizacao(dados).then(response => {
        alert("Dados salvos com sucesso!");
    }).catch(error => {
        console.log(error);
    });

}

export function carregarNuvem(): fiscalizacao[] {

    const [resultados, setResultados] = useState<any>();

    let retorno: fiscalizacao = {
        data: "", descricao: "", hora: "", observacoes: "", resultados: []
    }

    const firebaseApp = initializeApp({
        apiKey: "AIzaSyCrkZLQyEtBVgH64abl_B2KBwJ-oQU8st8",
        authDomain: "fiscaliza-desempenho.firebaseapp.com",
        projectId: "fiscaliza-desempenho",
    });

    const db = getFirestore(firebaseApp);

    async function getResultados(db: Firestore) {
        const resultadosCollection = collection(db, "fiscalizacoes");
        const resutadosSnapshot = await getDocs(resultadosCollection);
        const resultadosLista = resutadosSnapshot.docs.map(doc => doc.data());

        return resultadosLista;
    }

    getResultados(db).then(response => setResultados(response));

    return resultados;
}


export function put(resultados: resultado) {

    //primeiro a gente pega o objeto que está no localStorage
    let resultadoLista: resultado[] = localizarResultados();

    resultadoLista.push(resultados);


    localStorage.setItem("resultado", JSON.stringify(resultadoLista));


}

export function relatorio(): linha[] {
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


    linhas.forEach(linha => {

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
            viagens.sort((a, b) => a.horario > b.horario ? 1 : -1);

            linhasResultado.push({
                linha: parseInt(linha.toString()),
                viagens: viagens
            })
        }
    )
    //ordenando por ordem crescente de linha. Pra fazer graça
    linhasResultado.sort((a, b) => a.linha > b.linha ? 1 : -1);


    return linhasResultado;


    //navigator.clipboard.writeText(JSON.stringify(linhasResultado));
    //navigator.clipboard.writeText(tabela); //Função que atualiza 
}

export function encontrarIntervalos(viagens: viagem[]): number[] {

    let horarios: number[] = [];

    //usados para armazenar o intervalo em minutos
    let intervalos: number[] = [];

    //convertendo para minutos tudo
    viagens.forEach(
        (x, index) => {
            let horas: number = parseInt(x.horario.substring(0, 2)) * 60;
            let minutos: number = parseInt(x.horario.substring(3, 5));
            horarios[index] = horas + minutos;
        }
    )

    //agora vamos criar um array de intervalos, que é o nosso foco real
    horarios.forEach((x, index) => {
        if (index === 0) {
            ;
        } else {
            intervalos[index - 1] = horarios[index] - horarios[index - 1];
        }
    })

    return intervalos;
}






