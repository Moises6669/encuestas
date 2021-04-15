import React, { useState, useRef } from 'react'
import axios from 'axios'
import CreateInput from './CreateInput'
import Modal from 'react-modal'
import sucessImg from '../../img/sucess.png'
import SuccessModal from '../molecules/SuccessModal'
import { BiAddToQueue, BiSend } from 'react-icons/bi'
import { Errors } from '../atom/index'
import { Token } from '../functions/index'
import { useActive } from '../hooks/index'
import '../css/ModalSurvey.css'

Modal.setAppElement('#root')

const ModalSurvey = ({ state, toggle, reload }) => {
    const [active, toggleActive] = useActive()
    const data = Token();
    const inputTitle = useRef()
    const inputQuestion = useRef()
    const inputOption = useRef()
    const [options, setOptions] = useState([])
    const [error, setError] = useState()
    const [survey, setSurvey] = useState({
        created_by: "",
        description: '',
        questions: []
    })

    const inputHandle = (e) => {
        e.preventDefault();

        const name = inputQuestion.current.value;

        if(!inputTitle.current.value && !name) {
            setError('Los campos no pueden estar vacios')
        } else if(!inputTitle.current.value) {
            setError('Añada un titulo a la encuesta')
        } else if(!name) {
            setError('Añada una pregunta a la encuesta')
        } else if(options.length < 2 || options.length === 0) {
            setError('Añade 2 o mas opciones')
        } else {
            setSurvey({
                created_by: data._id,
                description: inputTitle.current.value,
                questions: [
                    ...survey.questions,
                    {
                        name,
                        options
                    }
                ]
            })
    
            inputQuestion.current.value = "";
            setOptions([]);
        }
    }

    const optionHandle = (e) => {
        e.preventDefault();

        const name = inputOption.current.value

        if(!name) {
            setError('Añade opciones a tus preguntas')
        } else {
            setOptions([
                ...options,
                name
            ])
            inputOption.current.value = "";
        }
    }

    const postSurvey = async (data) => {
        await axios.post('/api/poll', data)
            .then(resp => console.log(resp))
            .catch(error => console.log(error))
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!survey.questions || !survey.description) {
            setError('Asegurate de haber llenado correctamente los campos')
        } else {  
            postSurvey(survey)
            setError()
            setSurvey()
            reload();
            toggleActive(true)
        }
    }

    const deleteQuestion = (e) => {
        const dataTarget = e.target.getAttribute('data-target')

        const newSurvey = survey.questions.filter(resp => resp.name !== dataTarget)

        setSurvey({
            ...survey,
            questions: newSurvey
        })
    }

    const deleteOption = e => {
        const dataOption = e.target.getAttribute('data-option')
        const dataParent = e.target.getAttribute('data-parent')

        let index;

        survey.questions.map(resp => resp.name === dataParent ? (
            resp.options.length <= 1 ? (
                setError('La pregunta no puede quedar sin respuestas')
            ) : (
                index = resp.options.indexOf(dataOption),
                resp.options.splice(index, 1)
            )
        ) : null)

        setSurvey({...survey})
    }

    const successButton = () => {
        window.location.reload();
    }

    return (
        <Modal
            isOpen={ state }
            onRequestClose={ toggle }
            className="modal-survey"
            style={
                {
                    overlay: {
                        position: 'fixed',
                        zIndex: '20',
                        top: '0',
                        left: '0',
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }
                }
            }
        >
            <div className="modal-head">
                <h1 className="modal-title">Crear nueva encuesta</h1>
                <button className="modal-close" onClick={ toggle }>X</button>
            </div>
            <form className="modal-body" onSubmit={handleSubmit}>
                <div className="survey-head">
                    <input
                        name="title"
                        type="text"
                        placeholder="Titulo de encuesta"
                        id="title"
                        className="survey-title"
                        ref={ inputTitle }
                        autoComplete="off"
                    />
                    <div className="tools-buttons">
                        <button 
                            className="add btn" 
                            onClick={inputHandle}
                            title="Añadir nueva pregunta"
                        >
                            <BiAddToQueue 
                                className="icon"
                            />
                        </button>
                        <button 
                            className="send btn"
                            title="Enviar encuesta"
                        >
                            <BiSend 
                                className="icon"
                            />
                        </button>
                    </div>
                </div>
                {
                    error && <Errors error={error}/>
                }
                <div className="survey-body">
                    <CreateInput
                        optionHandle={ optionHandle }
                        option={ inputOption }
                        question={ inputQuestion }
                        key="one"
                    />  
                </div>
            </form>
            <div className="survey-body">
                    {
                        survey && (
                            survey.questions.map((resp, index) =>
                            <div className="survey" key={ index * 20}>
                                    <button
                                        className="button-delete button-delete__question"
                                        data-target={resp.name}
                                        onClick={ e => deleteQuestion(e)}
                                    >
                                        X
                                    </button>
                                    <p
                                        className="question-show"
                                        key={ index }
                                    >
                                        {resp.name}
                                    </p>
                                    <ul>
                                    {
                                        resp.options.map((response, i) =>  <li key={ i }
                                        className="options-create"
                                        >
                                             <button
                                                className="button-delete button-delete__option"
                                                data-option={response}
                                                data-parent={resp.name}
                                                onClick={ e => deleteOption(e)}
                                            >
                                                X
                                            </button>
                                            <p
                                                key={ i }
                                            >
                                                {response}
                                            </p>
                                        </li>)
                                    }
                                    </ul>
                                </div>
                            )
                        )
                    }
            </div>
            <SuccessModal
                state={ active }
                toggle={ toggleActive }
                image={ sucessImg }
                title={ "Encuesta creada correctamente! 👍😁" }
                button={ successButton }
            />
        </Modal>
    )
}

export default ModalSurvey
