import {useState} from 'react';
import {Col, Dropdown, Row} from 'react-bootstrap';
import './Header.css';
import Resultados from './pages/Resultados';
import Terminado from './pages/Terminado';
import {resultado} from './types/tipos';
import {put} from './utils/resultadoUtils';
import {ImDatabase} from "react-icons/im";


export default function Header() {

    const [terminado, Setterminado] = useState(false);

    const valorInicial: resultado = {
        linha: '',
        prefixo: '',
        horario: '',
    }
    const [formValues, setFormValues] = useState(valorInicial);

    const handleInputChange = (e: any) => {
        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value});
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
        setFormValues({linha: '', prefixo: '', horario: ''});
    }

    function resetar() {


        if(confirm("Isso apagará todos os dados da fiscalização. Deseja realmente continuar?"))
        {
            localStorage.removeItem("linhas");
            localStorage.removeItem("resultado");
            window.location.reload();
        }
    }

    return (
        <div className="d-flex principal flex-column container mt-4">

            <div className="d-flex">
                <form name="novaEntrada" className="d-flex" onSubmit={handleSubmit}>
                    <Row className='align-items-end m-0 p-0'>
                        <Col xs={4} sm={4} className='d-flex flex-column p-0'>
                            <input className='form-control' placeholder='Linha' type="number" id='linha-input'
                                   name='linha' onChange={handleInputChange} value={formValues.linha} autoFocus={true}/>
                        </Col>
                        <Col xs={4} sm={4} className='d-flex flex-column pe-0'>
                            <input className='form-control' placeholder='Prefixo' type="number" name='prefixo'
                                   onChange={handleInputChange} value={formValues.prefixo}/>
                        </Col>
                        <Col xs={3} sm={3} className="m-0 pe-0">
                            <button className='btn btn-primary border' type='submit'>Adicionar</button>
                        </Col>

                        <Col xs={1} sm={1} className="m-0 p-0">
                            {
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="menu"><ImDatabase/></Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item > Salvar </Dropdown.Item>
                                        <Dropdown.Item > Carregar </Dropdown.Item>
                                        <Dropdown.Item onClick={()=>resetar()}> Limpar </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={() => Setterminado(!terminado)} > {terminado ? "Ver fiscalização" : "Ver relatório"} </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            }

                        </Col>

                    </Row>
                </form>
            </div>
            <div className='mt-4 resultados'><h4>Resultados:</h4>
                {
                    terminado ? <Terminado/> : <Resultados/>
                }
            </div>

        </div>
    )
}


