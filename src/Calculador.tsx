import { ChangeEventHandler, JSXElementConstructor, ReactElement, ReactFragment, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import './Calculator.css';
import Resultados from './pages/Resultados';
import Terminado from './pages/Terminado';
import { resultado } from './types/tipos';
import { put, relatorio} from './utils/put';

export default function Calculador() {

    const [terminado, Setterminado] = useState(false);

    const valorInicial: resultado = {
        linha: '',
        prefixo: '',
        horario: '',
    }
    const [formValues, setFormValues] = useState(valorInicial);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();

        let now = new Date();


        const envio: resultado = {
            linha: (e.target as any).linha.value,
            prefixo: (e.target as any).prefixo.value,
            horario: now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
        }

        if (envio.linha == "" || envio.prefixo == "") {
            alert("todos os campos devem ser preenchidos!");
        } else {

            put(envio);


            limpar();
        }

    }

    function limpar() {
        setFormValues({ linha: '', prefixo: '', horario: '' });
    }

    function resetar() {
        localStorage.removeItem("linhas");
        localStorage.removeItem("resultado");
        window.location.reload();
    }

    return (
        <div className="d-flex principal flex-column container">
            <Row className='mt-4'>
                <Col xs={4} sm={4}><button className='btn btn-secondary' onClick={() => resetar()}>Limpar</button></Col>
                <Col xs={8} sm={8}><button className='btn btn-secondary' onClick={() => Setterminado(!terminado)}>Gerar Relatório</button></Col>
            </Row>

            <div className="d-flex">
                <form name="novaEntrada" className="d-flex" onSubmit={handleSubmit}>
                    <Row className='align-items-end mt-4'>
                        <Col xs={4} sm={4} className='d-flex flex-column'>
                            <input className='form-control' placeholder='Linha' type="number" id='linha-input' name='linha' onChange={handleInputChange} value={formValues.linha} autoFocus={true} />
                        </Col>
                        <Col xs={4} sm={4} className='d-flex flex-column'>
                            <input  className='form-control' placeholder='Prefixo' type="number" name='prefixo' onChange={handleInputChange} value={formValues.prefixo} />
                        </Col>
                        <Col xs={4} sm={4}>
                            <button className='btn btn-primary border' type='submit'>Adicionar</button>
                        </Col>
                    </Row>
                </form>
            </div>
            <div className='mt-4 resultados'><h4>Resultados:</h4>
                {
                    terminado? <Terminado/> : <Resultados />
                }
            </div>

        </div>
    )
}


