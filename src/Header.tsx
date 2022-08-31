import {useState} from 'react';
import {Button, ButtonGroup, Col, Dropdown, ListGroup, Modal, Row} from 'react-bootstrap';
import './Header.css';
import Resultados from './pages/Resultados';
import Terminado from './pages/Terminado';
import {fiscalizacao, resultado} from './types/tipos';
import {carregarNuvem, localizarResultados, put, salvarNuvem} from './utils/resultadoUtils';
import {ImDatabase} from "react-icons/im";
import {recuperarObservacoes} from "./utils/observacoesUtils";
import firebase from "firebase/compat";
import {initializeApp} from "firebase/app";
import {addDoc, collection, Firestore, getDocs, getFirestore} from "firebase/firestore";


export default function Header() {

    const [terminado, Setterminado] = useState(false);
    const [showNuvem,setShowNuvem] = useState(false);
    const [resultadoNuvem, setResultadoNuvem] = useState<any>();

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


        if (confirm("Isso apagará todos os dados da fiscalização. Deseja realmente continuar?")) {
            localStorage.removeItem("linhas");
            localStorage.removeItem("resultado");
            window.location.reload();
        }
    }

    const handleUpload = () => {


        const agora = new Date();
        const hora: string = agora.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        const dia: string = agora.toLocaleDateString();

        const data: fiscalizacao = {
            data: dia,
            hora: hora,
            descricao: 'Salvo às ' + hora + ' de ' + dia,
            observacoes: recuperarObservacoes(),
            resultados: localizarResultados()
        }

        //console.log(data);
        salvarNuvem(data);

    }

    const handleCarregar = () => {


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

        getResultados(db).then(response=>{
            setResultadoNuvem(response);
            setShowNuvem(true);
            //console.log(resultadoNuvem);
        }).catch(error=> alert(error));


    }


    return (
        <div className="d-flex principal flex-column container mt-4">

            <div className="d-flex ">
                <form name="novaEntrada" className="d-flex" onSubmit={handleSubmit}>
                    <Row className='align-items-end m-0 p-0'>
                        <Col xs={3} sm={3} className='d-flex flex-column p-0 me-2'>
                            <input className='form-control' placeholder='Linha' type="number" id='linha-input'
                                   name='linha' onChange={handleInputChange} value={formValues.linha} autoFocus={true}/>
                        </Col>
                        <Col xs={3} sm={3} className='d-flex flex-column p-0 me-2'>
                            <input className='form-control' placeholder='Prefixo' type="number" name='prefixo'
                                   onChange={handleInputChange} value={formValues.prefixo}/>
                        </Col>
                        <Col xs={3} sm={3} className="p-0 m-0 me-2">
                            <button className='btn btn-primary border m-0' type='submit'>Adicionar</button>
                        </Col>

                        <Col xs={1} sm={1} className="m-0 p-0">
                            {
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="menu"><ImDatabase/></Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => handleUpload()}> Salvar </Dropdown.Item>
                                        <Dropdown.Item onClick={()=> handleCarregar()} > Carregar </Dropdown.Item>
                                        <Dropdown.Item onClick={() => resetar()}> Limpar </Dropdown.Item>
                                        <Dropdown.Divider/>
                                        <Dropdown.Item
                                            onClick={() => Setterminado(!terminado)}> {terminado ? "Ver fiscalização" : "Ver relatório"} </Dropdown.Item>
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

            <Modal
                show={showNuvem} onHide={() => setShowNuvem(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Fiscalizações Salvas:</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {
                        resultadoNuvem?.map((x: any, index: number) => (

                            <ListGroup>

                                <ListGroup.Item variant="primary" action>{index+1} - { x.descricao }</ListGroup.Item>

                            </ListGroup>



                        ))
                    }
                </Modal.Body>

            </Modal>

        </div>


    )
}


