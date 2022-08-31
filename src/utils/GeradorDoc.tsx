import pdfMake from "pdfmake/build/pdfMake";
import {encontrarIntervalos, relatorio} from "./resultadoUtils";
import {infoOS, infoRelatorio, linha} from "../types/tipos";
import {recuperarEntrada} from "./infosOS";
import pdfFonts from "./fonts/vsf_fonts";
import {recuperarObservacoes} from "./observacoesUtils";

pdfMake.vfs = pdfFonts;


export function geradorDoc(detalhes: infoRelatorio) {


    const nome_agente = 'Jonathas';
    //const dia: Date = new Date();

    const resultado: linha[] = relatorio();

    let body: any = [];

    resultado.forEach(x => {


        const viagens: number = x.viagens.length;
        const intervalo_min: number = Math.min(...encontrarIntervalos(x.viagens));
        const intervalo_max = Math.max(...encontrarIntervalos(x.viagens));
        const intervalo_medio: number = encontrarIntervalos(x.viagens).reduce((a, b) => a + b, 0) / encontrarIntervalos(x.viagens).length;


        //variáveis que serão recebidas pelo programa:
        const infoVazia: infoOS = {
            linha: 0,
            frota: 0,
            intervalo: 0
        }

        //variável para guardar os números individuais da frota
        let veiculos: number[] = [];
        x.viagens.forEach(viagem => {
            if (!veiculos.includes(viagem.prefixo)) {
                veiculos.push(viagem.prefixo);
            }
        })

        const infos = recuperarEntrada(x.linha) || infoVazia;

        body.push(
            [
                {text: x.linha, border: [true, false, true, true], alignment: 'center'},
                {text: viagens, alignment: 'center', border: [true, false, true, true]},
                {text: veiculos.length, alignment: 'center', border: [true, false, true, true]},
                {
                    text: infos?.frota != 0 ? infos?.frota : {text: '-', color: 'red'},
                    alignment: 'center',
                    border: [true, false, true, true]
                },
                {text: `${intervalo_min} min`, alignment: 'center', border: [true, false, true, true]},
                {text: `${intervalo_max} min`, alignment: 'center', border: [true, false, true, true]},
                {text: `${Math.round(intervalo_medio)} min`, alignment: 'center', border: [true, false, true, true]},
                {
                    text: infos?.intervalo != 0 ? `${infos?.intervalo} min` : {text: 'sem info', color: 'red'},
                    alignment: 'center',
                    border: [true, false, true, true]
                }
            ]
        )
    })

    //preenchendo dinamicamente a lista com as viagens
    let viagensBody: any = [];

    //criando o cabeçalho dessa tabela:
    viagensBody.push([
        {text: 'Linha', alignment: 'center', bold: true, fillColor: '#FFF5EE'},
        {text: 'Prefixo', alignment: 'center', bold: true, fillColor: '#FFF5EE'},
        {text: 'Horário realizado', alignment: 'center', bold: true, fillColor: '#FFF5EE'}

    ])

    resultado.forEach(x => {

        x.viagens.forEach(y => {
            viagensBody.push([
                {text: x.linha, alignment: 'center'},
                {text: y.prefixo, alignment: 'center'},
                {text: y.horario, alignment: 'center'}
            ])
        })

    })


    //Inicio do documento

    var docDefinition: any = {
        info: {
            title: 'relatorio',
            author: 'Jonathas Silva',
            subject: 'Relatório de Fiscalização preenchido dinamicamente',
            keywords: '',
        },
        content: [
            {
                text: 'Relatório de Desempenho',
                style: 'header',
                alignment: 'center'
            },

            //Cabeçalho
            {
                margin: [0, 0, 0, 10],
                table: {
                    widths: [115, 115, 115, 115],
                    body: [
                        [{
                            text: ['Agente: ', {text: `${detalhes.agente}`, bold: false}],
                            colSpan: 3
                        }, {}, {}, {text: `Matrícula: ${detalhes.matricula}`}],
                        [{text: `Endereço: ${detalhes.local}`, colSpan: 4}, {}, {}, {}],
                        [{text: `Sentido: ${detalhes.sentido}`, colSpan: 2}, {}, {
                            text: `Ponto nº: ${detalhes.ponto}`,
                            colSpan: 2
                        }, {}],
                        [{text: `Data: ${detalhes.data}`, colSpan: 2}, {}, {
                            text: `Clima: ${detalhes.clima}`,
                            colSpan: 2
                        }, {}]
                    ]
                }
            },
            {
                text: 'Resultados:',
                style: 'subheader',
                margin: [0, 15, 0, 10]
            },
            {
                table: {
                    widths: [50, 55, 65, 35, 55, 55, 55, 55],
                    body: [
                        [
                            {text: '', border: [false, false, false, false]},
                            {text: '', border: [false, false, false, false]},
                            {text: 'Frota', colSpan: 2, alignment: 'center', fillColor: '#eeeeff', bold: true}, {},
                            {
                                text: 'Intervalos',
                                colSpan: 4,
                                alignment: 'center',
                                fillColor: '#eeffee',
                                bold: true
                            }, {}, {}, {}],
                        [
                            {text: 'Linha', border: [true, true, true, true], alignment: 'center'},
                            {text: 'Viagens', alignment: 'center'},
                            {text: 'Observada', alignment: 'center', fillColor: '#eeeeff'},
                            {text: 'OS', alignment: 'center', fillColor: '#eeeeff'},
                            {text: 'Min.:', alignment: 'center', fillColor: '#eeffee'},
                            {text: 'Máx: ', alignment: 'center', fillColor: '#eeffee'},
                            {text: 'Méd.:', alignment: 'center', fillColor: '#eeffee'},
                            {text: 'OS', alignment: 'center', fillColor: '#eeffee'}]
                    ]
                },

            },
            {
                //tabela dinâmica com os resultados propriamente ditos
                table: {
                    widths: [50, 55, 65, 35, 55, 55, 55, 55],
                    body: body
                }
            },


            //Aqui inserimos as observações somente se o tamanho do texto digitado for maior que 10
            {
                text: recuperarObservacoes().length > 10 ? "Observações do Agente" : "",
                style: "subheader2",
                margin: [0, 25, 0, 0]
            },
            {
                text: recuperarObservacoes().length > 10 ? recuperarObservacoes() : "",
                margin: [0, 0, 15, 0],
                fontSize: 11
            },
            //inserindo uma quebra de página
            {
                text: '',
                pageBreak: 'before'
            },
            {
                text: 'Detalhamento da Fiscalização:',
                style: 'subheader',
                margin: [0, 0, 0, 10]
            },
            {
                alignment: 'justify',
                columns: [
                    {
                        table: {
                            widths: [100, 100, 100],
                            headerRows: 1,
                            body: viagensBody
                        }
                    }]
            }

        ],

        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 20] //margem de 20 pra baixo
            },
            subheader: {
                fontSize: 14,
                bold: true
            },
            subheader2: {
                fontSize: 12,
                bold: true
            },
            table: {
                margin: [0, 10, 0, 5]
            },
            zeroMargin: {
                margin: [0, 0, 0, 0]
            },
            noBorders: {
                border: [false, false, false, false]
            },
            borders: {
                border: [true, true, true, true]
            }

        }
    }

    pdfMake.createPdf(docDefinition).open();


}
