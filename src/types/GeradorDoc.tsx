import pdfMake from "pdfmake/build/pdfMake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { encontrarIntervalos, relatorio } from "../utils/put";
import { infoRelatorio, linha } from "./tipos";

pdfMake.vfs = pdfFonts.pdfMake.vfs;



export function geradorDoc(detalhes:infoRelatorio) {



    const dia: Date = new Date();

    const resultado: linha[] = relatorio();

    let body: any = [];

    resultado.forEach(x => {

        const viagens: number = x.viagens.length;
        const intervalo_min: number = Math.min(...encontrarIntervalos(x.viagens));
        const intervalo_max = Math.max(...encontrarIntervalos(x.viagens));
        const intervalo_medio: number = encontrarIntervalos(x.viagens).reduce((a, b) => a + b, 0) / encontrarIntervalos(x.viagens).length;


        //variáveis que serão recebidas pelo programa:
        const frotaOS: number = -1;
        const intervaloOS: number = -1;

        //variável para guardar os números individuais da frota
        let veiculos: number[] = [];
        x.viagens.forEach(viagem => {
            if (!veiculos.includes(viagem.prefixo)) {
                veiculos.push(viagem.prefixo);
            }
        })

        body.push(

            [
                { text: x.linha, border: [true, false, true, true], alignment: 'center' },
                { text: viagens, alignment: 'center', border: [true, false, true, true] },
                { text: veiculos.length, alignment: 'center', border: [true, false, true, true] },
                { text: detalhes.frotaOS, alignment: 'center', border: [true, false, true, true] },
                { text: `${intervalo_min}min`, alignment: 'center', border: [true, false, true, true] },
                { text: `${intervalo_max}min`, alignment: 'center', border: [true, false, true, true] },
                { text: `${Math.round(intervalo_medio)}min`, alignment: 'center', border: [true, false, true, true] },
                { text: `${detalhes.IntervaloOS}min`, alignment: 'center', border: [true, false, true, true] }
            ]

        )
    })

    //preenchendo dinamicamente a lista com as viagens
    let viagensBody: any = [];

    //criando o cabeçalho dessa tabela:
    viagensBody.push([
        { text: 'Linha', alignment: 'center', bold: true, fillColor: '#FFF5EE'},
        { text: 'Prefixo', alignment: 'center', bold: true,fillColor: '#FFF5EE' },
        { text: 'Horário realizado', alignment: 'center', bold: true,fillColor: '#FFF5EE' }

    ])

    resultado.forEach(x => {

        x.viagens.forEach(y => {
            viagensBody.push([
                { text: x.linha, alignment: 'center' },
                { text: y.prefixo, alignment: 'center' },
                { text: y.horario, alignment: 'center' }
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
                        [{ text: `Agente: ${detalhes.agente}`, colSpan: 3 }, {}, {}, { text: `Matrícula: ${detalhes.matricula}` }],
                        [{ text: `Endereço: ${detalhes.local}`, colSpan: 4 }, {}, {}, {}],
                        [{text: `Sentido: ${detalhes.sentido}`, colSpan:2}, {}, {text: `Ponto nº: ${detalhes.ponto}`, colSpan:2}, {}],
                        [{ text: `Data: ${dia.toLocaleDateString()}`, colSpan: 2 }, {}, { text: `Clima: ${detalhes.clima}`, colSpan: 2 }, {}]
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
                            { text: '', border: [false, false, false, false] },
                            { text: '', border: [false, false, false, false] },
                            { text: 'Frota', colSpan: 2, alignment: 'center', fillColor: '#eeeeff', bold: true }, {},
                            { text: 'Intervalos', colSpan: 4, alignment: 'center', fillColor: '#eeffee', bold: true }, {}, {}, {}],
                        [
                            { text: 'Linha', border: [true, true, true, true], alignment: 'center' },
                            { text: 'Viagens', alignment: 'center' },
                            { text: 'Observada', alignment: 'center', fillColor: '#eeeeff' },
                            { text: 'OS', alignment: 'center', fillColor: '#eeeeff' },
                            { text: 'Min.:', alignment: 'center', fillColor: '#eeffee' },
                            { text: 'Máx: ', alignment: 'center', fillColor: '#eeffee' },
                            { text: 'Méd.:', alignment: 'center', fillColor: '#eeffee' },
                            { text: 'OS', alignment: 'center', fillColor: '#eeffee' }]
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
                    {table: {
                        widths: [100, 100, 100],
                        headerRows: 1,
                        body: viagensBody
                    }}]
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
