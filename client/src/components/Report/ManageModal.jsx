import React, { useState, useContext, useEffect} from 'react'
import './manage-transactions.css';
import {timeStampToDateString} from '../Input-validation';
import EditModal from '../HomePage/EditModal';
import {AiOutlineDelete, AiFillEdit, AiOutlineLeftCircle} from 'react-icons/ai';
import DeleteModal from '../HomePage/DeleteModal';
import { TransactionContext } from '../../context/TransactionContext';

const DEFAULT_MESSAGE = `Manage Transactions`;

const ManageModal = ({data, close}) => {
    const {transactions} = useContext(TransactionContext)
    const [modalOn, setModalOn] =  useState(false);
    const [deleteModalOn, setDeleteModalOn] =  useState(false);
    const [amount, setAmount] = useState()
    const [type, setType] = useState()
    const [narration, setNarration] = useState()
    const [story, setStory] = useState()
    const [date, setDate] = useState()
    const [id, setId] = useState()
    const [input_, setInput] = useState('')
    const [message, setMessage] = useState(DEFAULT_MESSAGE)
    const [specificData, setSpecificData] = useState([...transactions])

    useEffect(()=>{
        setSpecificData(transactions);
    },[transactions])

    return (
        <div className="manage-transactions">
            <div className="manage-container">
                <h1>{message}</h1>
                <form onSubmit={(e)=>{
                    e.preventDefault();
                    setMessage(`Searching for "${input_}"`)
                    setInput('')
                }}>
                    <input 
                        onChange = {(e)=>{
                            setMessage(DEFAULT_MESSAGE)
                            if(!e.target.value){
                            }
                            setInput(e.target.value)
                            setSpecificData(data.filter(item =>item.narration.includes(e.target.value.toString()) || item.amount.toString().includes(e.target.value)))
                        }} 
                        type="text" placeholder="Search Transactions" value={input_}/>
                    <button type="submit">Go</button>
                </form>
                <ol>
                    {specificData.length>0 ? specificData.map((item, index) =>{
                        return (
                        <li key={item._id} className="manage-item">
                            <em className={item.type}>{index + 1}</em>
                            <span>{item.narration}</span> 
                            <strong className={item.type}>{parseFloat(item.amount).toFixed(2)}</strong>
                            <pre className={item.type}>{item.story ? item.story : <span>no description available</span>}</pre>
                            <p>Transaction Date: {timeStampToDateString(item.transaction_date)}</p>
                            <div className="manage-btn-box">
                                <AiOutlineDelete 
                                    onClick = {()=>{
                                        setId(item._id)
                                        setDeleteModalOn(true)
                                    }}    
                                    title="Edit Transaction"
                                    className="manage-icon"/>
                                <AiFillEdit 
                                    className="manage-icon"
                                    title="Edit Transaction"
                                    onClick = {()=>{
                                        setAmount(item.amount)
                                        setType(item.type)
                                        setNarration(item.narration)
                                        setStory(item.story)
                                        setDate(item.transaction_date)
                                        setId(item._id)
                                        setModalOn(true)
                                    }}    
                                />
                            </div>
                        </li>)
                    }) : <h1>No transactions found</h1>}
                </ol>
                <AiOutlineLeftCircle title="Go Back" className="manage-icon manage-return" onClick={() => {
                    close(false)
                    document.querySelector('body').style.overflowY = 'scroll';
                    document.documentElement.scrollIntoView()
                    }}/>
            </div>
            {modalOn && 
                <EditModal 
                    setModalOpen={setModalOn} 
                    modalOpen={modalOn} 
                    amount = {amount} 
                    type={type} 
                    narration={narration} 
                    story={story}
                    date = {date}
                    id = {id}
                />
            }
            {deleteModalOn && 
                <DeleteModal id={id} setModalOpen = {setDeleteModalOn} />
            }
        </div>
    )
}

export default ManageModal
