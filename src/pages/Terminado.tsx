import {Col, Modal, ModalFooter, Row, Stack} from "react-bootstrap";
import {infoOS, infoRelatorio, linha, resultado, viagem} from "../types/tipos";
import {localizarResultados, relatorio} from "../utils/resultadoUtils";
import './Terminado.css';

import {geradorDoc} from "../utils/GeradorDoc";
import {useEffect, useState} from "react";
import {MdBusAlert} from 'react-icons/md';
import {inserirInfos, localizarIndice, recuperarEntrada} from "../utils/infosOS";
import {recuperarObservacoes, salvarObservacoes} from "../utils/observacoesUtils";


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

    geradorDoc(dadosAdicionais);
}


export default function Terminado() {

    const [show, setShow] = useState(false);
    const [showObserv, setShowObserv] = useState(false);

    const [showConfig, setShowConfig] = useState({mostrar: false, linha: 0});
    const [render, setRender] = useState(false);

    useEffect(() => {

    }, [render])


    const resultado: linha[] = relatorio();

    const limparInfos = () => {
        let confirma = confirm("Isso apagará as informações de todas as linhas. Deseja continuar?");

        if (confirma) {
            localStorage.removeItem("info");
        }

        setRender(!render);
    }

    const handleConfig = (e: any) => {
        e.preventDefault();

        const intervaloOS = (e.target as any).intervalo.value;
        const frotaOS = (e.target as any).frota.value;

        inserirInfos({
            linha: showConfig.linha,
            frota: frotaOS,
            intervalo: intervaloOS
        })

        setRender(!render);
    }

    const handleObserv = (e: any) => {
        e.preventDefault();

        const observacoes = (e.target as any).observacoes.value

        salvarObservacoes(observacoes);

    }


    let linhas: string[] = JSON.parse(localStorage.getItem("linhas") || "");


    return (
        <div className="mt-4">

            <div className="mb-3 badge bg-info">Clique sobre a linha com <MdBusAlert/> para configurar informações de
                OS.
            </div>

            {
                resultado.map((x, index) => (


                    <div key={index} className="text-center">
                        <button className="btn pb-0 btn-sm"
                                onClick={() => setShowConfig({mostrar: true, linha: x.linha})}>
                            <div className="h5">
                                Linha {x.linha} {(localizarIndice(x.linha)) != -1 ? '' : <MdBusAlert/>} </div>
                        </button>
                        <div className="mb-1 border">


                            {

                                x.viagens?.map((y, index) => (
                                    <Row key={index} className=""><Col
                                        className="border-end">{y.prefixo}</Col><Col>{y.horario}</Col></Row>
                                ))
                            }


                        </div>


                        <div className="mb-3 border text-start ps-2 pe-2">
                            {
                                (x.viagens.length == 1) ?
                                    <div className="text-warning">Sem dados suficientes para calcular as
                                        estatísticas</div> :
                                    <div>
                                        Viagens: {x.viagens.length} <br/>
                                        Intervalo mínimo: {Math.min(...encontrarIntervalos(x.viagens))} minutos<br/>
                                        Intervalo máximo: {Math.max(...encontrarIntervalos(x.viagens))} minutos<br/>
                                        Intervalo médio: {
                                        Math.round(encontrarIntervalos(x.viagens).reduce((a, b) => a + b, 0) / encontrarIntervalos(x.viagens).length)

                                    } minutos
                                    </div>
                            }

                        </div>
                    </div>
                ))
            }


            <div className="d-flex justify-content-between">
                <button className="btn btn-primary" onClick={() => setShow(true)}>Gerar PDF</button>
                <button className="btn btn-info" onClick={() => setShowObserv(true)}>Adicionar observações</button>
            </div>

            <Modal
                show={showConfig.mostrar} onHide={() => setShowConfig({mostrar: false, linha: 0})}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Configurar Linha {showConfig.linha}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form name="dadosAdicionais" onSubmit={handleConfig}>
                        <label htmlFor="frota">Intervalo OS (em minutos):</label>
                        <input type="number" id="intervalo" className="form-control"
                               defaultValue={recuperarEntrada(showConfig.linha)?.intervalo || ''}/>
                        <label htmlFor="frota">Frota OS:</label>
                        <input type="number" id="frota" className="form-control"
                               defaultValue={recuperarEntrada(showConfig.linha)?.frota || ''}/>
                        <button className="mt-2 btn btn-info" type="submit"
                                onClick={() => setShowConfig({mostrar: false, linha: showConfig.linha})}>Salvar
                            Informações
                        </button>
                    </form>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-start">
                    <div className="">
                        <button className="btn btn-sm btn-dark" onClick={() => limparInfos()}>Limpar informações
                        </button>
                    </div>
                </Modal.Footer>

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
                        <input type="text" id='agente' className="form-control mb-1"
                               placeholder="Insira seu nome de guerra"/>
                        <label htmlFor="matricula" className="">Matrícula:</label>
                        <input type="number" id='matricula' className="form-control mb-1"/>
                        <label htmlFor="local" className="">Endereço completo:</label>
                        <input type="text" id='local' className="form-control mb-1"
                               placeholder="Ex: Av das Amoreiras, 680"/>
                        <label htmlFor="ponto" className="">Nº do ponto:</label>
                        <input type="number" id='ponto' className="form-control mb-1"/>
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

            <Modal
                show={showObserv} onHide={() => setShowObserv(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Observações</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="mb-2">Insira ou altere suas observações sobre a fiscalização:</div>
                    <form name="observacoes" onSubmit={handleObserv}>
                        <textarea name="textObservacoes" id="observacoes" className="form-control" defaultValue={recuperarObservacoes()}></textarea>
                        <button className="btn btn-primary mt-4" onClick={()=> setShowObserv(false)}>Salvar</button>
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


