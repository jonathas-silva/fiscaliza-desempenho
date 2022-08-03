import { Col, Row } from "react-bootstrap";
import { linha, viagem } from "../types/tipos";
import { relatorio } from "../utils/put";
import './Terminado.css';
import pdfMake from "pdfmake/build/pdfMake";
import pdfFonts from "pdfmake/build/vfs_fonts";

//Por que ? Não sei \o/
pdfMake.vfs = pdfFonts.pdfMake.vfs;

var docDefinition: any = {
    content: [
        { text: 'Relatório de Fiscalização', style: 'header' },
        { text: 'Agente: Fulano de tal \n matrícula: 1234', margin: [0, 0, 0, 10] }
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
        }

    }
}


export default function Terminado() {

    const resultado: linha[] = relatorio();

    function gerarPDF() {

        resultado.forEach(x => {

            const viagens: number = x.viagens.length;
            const intervalo_min = Math.min(...encontrarIntervalos(x.viagens));
            const intervalo_max = Math.max(...encontrarIntervalos(x.viagens));
            const intervalo_medio: number = encontrarIntervalos(x.viagens).reduce((a, b) => a + b, 0) / encontrarIntervalos(x.viagens).length;

            let frota_observada: number = -1;

            //variável para guardar os números individuais da frota
            let veiculos: number[] = [];
            x.viagens.forEach(viagem => {
                if (!veiculos.includes(viagem.prefixo)) {
                    veiculos.push(viagem.prefixo);
                }
            }
            )





            /*             let diferenca = intervalo_medio - Math.floor(intervalo_medio); //achar as casas decimais
                        let medio_string: string = '';
                        if(diferenca == 0){
                            medio_string = `${intervalo_medio.toString()}'`;
                        }else{
                            medio_string = `${Math.floor(intervalo_medio)}'${diferenca.toPrecision(2).toString()}''`
                        } */


            docDefinition.content.push({
                margin: [0, 20, 0, 0],
                table: {
                    widths: [175, 175],
                    body: [
                        [{ text: `Linha ${x.linha}`, colSpan: 2, alignment: 'center', style: 'subheader' }, {}],
                        [`Intervalo mínimo: ${intervalo_min} min`, `Intervalo máximo: ${intervalo_max} min`],
                        [`Intervalo médio: ${Math.round(intervalo_medio)} min`, `Intervalo OS: `],
                        [`Frota observada: ${veiculos.length} ${veiculos.length > 1 ? 'veículos' : 'veículo'}`, `Frota OS:`],
                        [{ text: `${viagens} viagens observadas:`, colSpan: 2,italics: true, border: [false, true, false, false]}, {}],
                        [{text: 'Horário', bold: true, color: 'gray', border:[false,false,false,false]}, {text: 'Prefixo', bold: true, color: 'gray', border:[false,false,false,false]}]
                    ]

                }
            }

            )
            x.viagens.forEach(y=>{
                docDefinition.content.push({
                    margin: [5, 0, 0, 0],
                    table: {
                        widths: [175, 175],
                        body: [
                            [{text: `${y.horario}`, color: 'gray'}, {text: `${y.prefixo}`, color: 'gray'}]
                        ]
                    },
                    layout: 'lightHorizontalLines'
                })
            })

        })
        pdfMake.createPdf(docDefinition).open();
    }


    return (
        <div className="mt-4">



            {
                resultado.map(x => (



                    <div className="text-center">
                        <Row className="h5 bordas"><div>Linha {x.linha}</div></Row>
                        <div className="mb-2 border">
                            {

                                x.viagens?.map(y => (
                                    <Row className=""><Col className="border-end">{y.prefixo}</Col><Col>{y.horario}</Col></Row>
                                ))
                            }


                        </div>



                        <div className="mb-3 border text-start ps-2 pe-2">
                            {
                                (x.viagens.length == 1) ? <div className="text-warning">Sem dados suficientes para calcular as estatísticas</div> :
                                    <div>
                                        Viagens: {x.viagens.length} <br />
                                        Intervalo mínimo: {Math.min(...encontrarIntervalos(x.viagens))} <br />
                                        Intervalo máximo: {Math.max(...encontrarIntervalos(x.viagens))} <br />
                                        Intervalo médio: {
                                            encontrarIntervalos(x.viagens).reduce((a, b) => a + b, 0) / encontrarIntervalos(x.viagens).length

                                        }
                                    </div>
                            }

                        </div>
                    </div>
                ))
            }



            <button className="btn btn-primary" onClick={() => gerarPDF()}>Gerar PDF</button>

        </div>

    )
}

function encontrarIntervalos(viagens: viagem[]): number[] {

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















/*

            //setando o horário com o horário da viagem.
            //estamos convertendo para poder realizar operações sobre os horários
            horario.setHours(parseInt(x.horario.substring(0, 2)), parseInt(x.horario.substring(3, 5)));
            horarios[index] = horario;

            //setando o mínimo e o máximo no índice zero.
        }
    )

    //Agora já criamos uma array de datas. Mais fácil para fazer as contas
    horarios.forEach((x,index) => {
        if(index===0){
            min = x;
            max = x;
        } else if(x[index] < min){
        }
    })


    return horario.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); */
//}