import React, {useState, useContext} from 'react';
import axios from 'axios';
import { inputValdiator, timeStampToDateString, dateStringToTimeStamp } from '../Input-validation';
import './home.css';
import {MdClose} from 'react-icons/md'
import { TransactionContext } from '../../context/TransactionContext';
import { GuestContext } from '../../context/GuestContext';



const EditModal = (props) => {
    const {transactions,setTransactions} = useContext(TransactionContext);
    const {editGuest} = useContext(GuestContext);
    
    const [narration, setNarration] = useState(props.narration);
    const [amount, setAmount] = useState(props.amount);
    const [type, setType] = useState(props.type)
    const [story, setStory] = useState(props.story||'')
    const [txnDate, setTxnDate] = useState(timeStampToDateString(props.date))
    const [id] = useState(props.id)
    
    const [msg, setMsg] = useState('')
    const [error, setError] = useState(true)

    const editPostToDB = async (newTransaction) =>{
        const token = localStorage.getItem('DB_auth');
        if(token){
            const response = await axios.patch(`/api/${id}`,newTransaction, {
                headers:{
                    authorization:token
                }
            });

            if(response.status === 200){
                setMsg('Transaction updated successfully')
                setError(false)
                const filteredArray = [...transactions]
                filteredArray.forEach(item => {
                    if(item._id === id){
                        item.narration = newTransaction.narration;
                        item.type = newTransaction.type;
                        item.amount = newTransaction.amount;
                        item.transaction_date = newTransaction.transaction_date;
                        item.story = newTransaction.story;
                    }
            })
                setTransactions([...filteredArray]);
                localStorage.setItem('transactions',JSON.stringify(filteredArray))
            }
            else{
                setError(true)
                setMsg('Error updating transaction.')
            }
        }
        else{
            newTransaction._id = id
            editGuest(newTransaction)
            setMsg('transaction updated successfully')
            setError(false)
        }
    }

    return (
        <section className={`modal-${props.modalOpen}`}>
            <div className="modal-form-container">
                <MdClose 
                    className="close-modal" 
                    title="Close Modal"
                    onClick = {()=> props.setModalOpen(false)}
                />
                <form 
                    className="modal-form" autoComplete="false" 
                    onSubmit = {async e =>{
                    e.preventDefault();
                    const currentTransaction = {type};
                    if(inputValdiator(parseFloat(amount), narration).status && dateStringToTimeStamp(txnDate).status){
                        currentTransaction.amount = parseFloat(amount);
                        currentTransaction.narration = narration;
                        if(dateStringToTimeStamp(txnDate).status){
                            currentTransaction.transaction_date = dateStringToTimeStamp(txnDate).date;
                        }
                        else{
                            currentTransaction.transaction_date = Date.now();
                        }

                        if(story && story.trim().length > 1){
                            currentTransaction.story = story;
                        }
                        setError(false)
                        editPostToDB(currentTransaction);
                        setNarration('')
                        setStory('')
                        setTxnDate(timeStampToDateString(Date.now()))
                        setAmount('')
                        setTimeout(()=>{
                            props.setModalOpen(false)
                        },1000)
                    }
                    else{
                        setError(true)
                        setMsg(inputValdiator(amount,narration).message || dateStringToTimeStamp(txnDate).message)
                    }
                    
                }}>
                    <h1 className="modal-header">Edit Transaction</h1>
                    {msg && <span id="msg_span" className={`modal-message modal-error-${error}`}>{msg}</span>}
                    <div className="modal-group">
                        <input 
                            name="narration"
                            autoComplete="false"
                            type="text" 
                            value={narration} 
                            placeholder="Description" 
                            onChange={e => {
                                setNarration(e.target.value)
                                setMsg('')
                            }}
                            className="modal-field modal-required"
                        />
                    </div>

                    <div className="modal-group">
                        <select 
                            name="type"
                            className="modal-select modal-required"
                            value={type}
                            onChange = {e => {
                                setType(e.target.value)
                                setMsg('')
                            }}
                        >
                            <option value="inc">Income</option>
                            <option value="exp">Expense</option>
                        </select>
                        <input 
                            name="amount"
                            type="number" 
                            autoComplete="false"
                            placeholder="Amount" 
                            min="1"
                            value={amount} 
                            onChange={e => {
                                setAmount(e.target.value)
                                setMsg('')
                            }}
                            className="modal-field modal-required"
                        />
                    </div>

                    <div className="modal-group">
                        <textarea 
                            name="story"
                            autoComplete="false"
                            placeholder="Details of the transaction" 
                            value={story} 
                            className="modal-field"
                            onChange={e => {
                                setStory(e.target.value)
                                setMsg('')
                            }}
                        ></textarea>
                    </div>
                    <div className="modal-group">
                        <label htmlFor="date">Transaction Date</label>
                        <input 
                            id="date"
                            name="transaction_date"
                            type="date" 
                            value={txnDate} 
                            onChange={e => {
                                setTxnDate(e.target.value)
                                setMsg('')
                            }}
                            className="modal-field"
                        />
                    </div>

                    <button type="submit" className="modal-btn">add</button>
                </form>
            </div>
        </section>
    )
}

export default EditModal
