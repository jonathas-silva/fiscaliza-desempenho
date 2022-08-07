import { Col, Modal, Row, Stack } from "react-bootstrap";
import { infoOS, infoRelatorio, linha, resultado, viagem } from "../types/tipos";
import { localizarResultados, relatorio } from "../utils/resultadoUtils";
import './Terminado.css';
import pdfMake from "pdfmake/build/pdfMake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { geradorDoc } from "../utils/GeradorDoc";
import { useState } from "react";
import { MdBusAlert } from 'react-icons/md';
import { inserirInfos, localizarIndice, recuperarEntrada } from "../utils/infosOS";

//Por que ? Não sei \o/
pdfMake.vfs = pdfFonts.pdfMake.vfs;






const handleSubmit = (e: any) => {
    e.preventDefault();



    let dadosAdicionais: infoRelatorio = {
        agente: (e.target as any).agente.value,
        matricula: (e.target as any).matricula.value,
        local: (e.target as any).local.value,
        sentido: (e.target as any).sentido.value,
        ponto: (e.target as any).ponto.value,
        clima: (e.target as any).clima.value
    }

    console.log(dadosAdicionais);

    geradorDoc(dadosAdicionais);
}




export default function Terminado() {

    const [show, setShow] = useState(false);
    const [showConfig, setShowConfig] = useState({mostrar: false, linha: 0});
    const resultado: linha[] = relatorio();

    const handleConfig = (e: any) => {
        e.preventDefault();
       
        const intervaloOS = (e.target as any).intervalo.value;
        const frotaOS = (e.target as any).frota.value;

        inserirInfos({
            linha: showConfig.linha,
            frota: frotaOS,
            intervalo: intervaloOS
        })


    }

    


    let linhas: string[] = JSON.parse(localStorage.getItem("linhas") || "");




    return (
        <div className="mt-4">

            <div className="mb-3 badge bg-info">Clique sobre a linha com <MdBusAlert /> para configurar informações de OS.</div>

            {
                resultado.map(x => (



                    <div className="text-center">
                        <button className="btn pb-0 btn-sm" onClick={() => setShowConfig({mostrar: true, linha: x.linha})}><div className="h5">
                            Linha {x.linha} { (localizarIndice(x.linha))!=-1?'':<MdBusAlert />} </div></button>
                        <div className="mb-1 border">




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
                                        Intervalo mínimo: {Math.min(...encontrarIntervalos(x.viagens))} minutos<br />
                                        Intervalo máximo: {Math.max(...encontrarIntervalos(x.viagens))} minutos<br />
                                        Intervalo médio: {
                                            Math.round(encontrarIntervalos(x.viagens).reduce((a, b) => a + b, 0) / encontrarIntervalos(x.viagens).length)

                                        } minutos
                                    </div>
                            }

                        </div>
                    </div>
                ))
            }



            <button className="btn btn-primary" onClick={() => setShow(true)}>Gerar PDF</button>

            <Modal
                show={showConfig.mostrar} onHide={() => setShowConfig({mostrar:false, linha: 0})}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Configurar Linha {showConfig.linha}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form name="dadosAdicionais" onSubmit={handleConfig}>
                        <input type="number" id="intervalo" className="form-control" defaultValue={recuperarEntrada(showConfig.linha)?.intervalo || ''}/>
                        <label htmlFor="frota">Frota OS:</label>
                        <input type="number" id="frota" className="form-control" defaultValue={recuperarEntrada(showConfig.linha)?.frota || ''}/>
                        <button className="mt-2 btn btn-info" type="submit" onClick={() => setShowConfig({mostrar:false, linha: showConfig.linha})}>Salvar Informações</button>
                    </form>
                </Modal.Body>

            </Modal>


            <Modal
                show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Gerar Relatório</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="mb-2">Parar gerar o relatório, complete os dados abaixo:</div>
                    <form name="dadosAdicionais" onSubmit={handleSubmit}>
                        <label htmlFor="agente" className="">Agente:</label>
                        <input type="text" id='agente' className="form-control mb-1" placeholder="Insira seu nome de guerra" />
                        <label htmlFor="matricula" className="">Matrícula:</label>
                        <input type="number" id='matricula' className="form-control mb-1" />
                        <label htmlFor="local" className="">Endereço completo:</label>
                        <input type="text" id='local' className="form-control mb-1" placeholder="Ex: Av das Amoreiras, 680" />
                        <label htmlFor="ponto" className="">Nº do ponto:</label>
                        <input type="number" id='ponto' className="form-control mb-1" />
                        <label htmlFor="local" className="">Sentido:</label>
                        <select id="sentido" className="form-select mb-1">
                            <option value='CXB'>CXB</option>
                            <option value='BXC'>BXC</option>
                            <option value='Taquaral x Guarani'>Taquaral x Guarani</option>
                            <option value='Guarani x Taquaral'>Guarani x Taquaral</option>
                            <option value='Bosque x Carmona'>Bosque x Carmona</option>
                            <option value='Carmona x Bosque'>Carmona x Bosque</option>
                        </select>
                        <label htmlFor="clima" className="">Clima:</label>
                        <select id="clima" className="form-select mb-1">
                            <option value='Ensolarado'>Ensolarado</option>
                            <option value='Chuvoso'>Chuvoso</option>
                            <option value='Nublado'>Nublado</option>
                            <option value='Estável'>Estável</option>
                        </select>

                        <button className="btn btn-primary mt-2" onClick={() => setShow(false)}>Salvar</button>
                    </form>
                </Modal.Body>

            </Modal>




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