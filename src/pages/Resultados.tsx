import { Col, Modal, Row, Stack } from "react-bootstrap";
import { resultado } from "../types/tipos";
import './Resultados.css';
import { useEffect, useState } from "react";
import { localizarResultados, put } from "../utils/resultadoUtils";

export default function Resultados() {

    const viagem: resultado = {
        linha: "",
        prefixo: "",
        horario: ""
    }

    const [excluir, setExluir] = useState(false);
    const [show, setShow] = useState({ mostrar: false, viagem: viagem });
    const [render, setRender] = useState(true);

    useEffect(() => {

    }, [render])

    //os métodos abaixo serão colocados em um get no futuro
    let resultados: resultado[] = localizarResultados();

    const handleSubmit = (e: any) => {

        e.preventDefault();

        const envio: resultado = {
            linha: (e.target as any).linha.value,
            prefixo: (e.target as any).prefixo.value,
            horario: (e.target as any).horario.value
        }


        //Aqui faremos uma operação complexa de busca no array e troca do elemento em questão.
        let index: number = resultados.findIndex((x) => x.linha === show.viagem.linha && x.horario === show.viagem.horario)

        if (excluir == true) {
            if (confirm("tem certeza que deseja excluir esse registro?")) {
                resultados.splice(index, 1);
                setShow({ mostrar: false, viagem: viagem });
                setExluir(false); //importante!!!
            }
        } else {
            resultados[index] = envio;
        }

        //aqui estamos ordenando antes de re-renderizar
        resultados.sort((a,b)=>a.horario>b.horario?1:-1);


        localStorage.setItem("resultado", JSON.stringify(resultados));

        //atualizando a renderização da lista
        setRender(!render);

    }



    return (

        <div className="resultados">

            <Row className="fw-bold m-2 tabela">
                <Col sm={3} xs={3}>Linha:</Col>
                <Col sm={4} xs={4}>Prefixo:</Col>
                <Col sm={3} xs={3}>Horario:</Col>
            </Row>
            {
                resultados.map(
                    (x, index) => (
                        <Stack key={index}>
                            <button className="btn btn-light border" onClick={() => setShow({ mostrar: true, viagem: x })}>
                                <Row className="text-center" key={index}>
                                    <Col sm={3} xs={3}>{x.linha}</Col>
                                    <Col sm={3} xs={3}>{x.prefixo}</Col>
                                    <Col sm={4} xs={4}>{x.horario}</Col>
                                    {/* <Col sm={2} xs={2}><BsFillPencilFill/></Col> */}
                                </Row>
                            </button>
                        </Stack>
                    )
                )
            }

            <Modal
                show={show.mostrar} onHide={() => setShow({ mostrar: false, viagem: viagem })}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar viagem</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form name="editarEntrada" onSubmit={handleSubmit}>
                        <label htmlFor="linha" className="form-label">Linha: </label>
                        <input type="number" max={599} id="linha" className="form-control" defaultValue={show.viagem.linha} />
                        <label htmlFor="prefixo" className="form-label">Prefixo: </label>
                        <input type="number" max={9999} id="prefixo" className="form-control" defaultValue={show.viagem.prefixo} />
                        <label htmlFor="horario" className="form-label">Horário: </label>
                        <input type="time" id="horario" className="form-control" defaultValue={show.viagem.horario} />
                        <button className="btn btn-primary mt-2" type="submit" onClick={() => setShow({ mostrar: false, viagem: { linha: show.viagem.linha, prefixo: show.viagem.prefixo, horario: show.viagem.horario } })}>Salvar</button>
                        <button className="btn btn-danger mt-2" onClick={() => setExluir(true)}>Excluir</button>

                    </form>
                </Modal.Body>

            </Modal>


        </div>


    )
}

