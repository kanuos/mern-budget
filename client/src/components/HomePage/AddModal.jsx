import React, {useState, useContext} from 'react';
import axios from 'axios';
import {timeStampToDateString, dateStringToTimeStamp, inputValdiator} from '../Input-validation';
import './home.css';
import {MdClose} from 'react-icons/md'
import { TransactionContext } from '../../context/TransactionContext';
import { GuestContext } from '../../context/GuestContext';

const Modal = (props) => {
    const {transactions,setTransactions} = useContext(TransactionContext);
    const {addGuest} = useContext(GuestContext);

    const [narration, setNarration] = useState(props.narration || '');
    const [amount, setAmount] = useState(props.amount || '');
    const [type, setType] = useState(props.type || 'exp')
    const [story, setStory] = useState(props.detail || '')
    const [txnDate, setTxnDate] = useState(timeStampToDateString(Date.now()))
    const [msg, setMsg] = useState('')
    const [error, setError] = useState(true)

    const addNewPostToDB= async (newTransaction) =>{
        const token = localStorage.getItem('DB_auth');
        if(token){
            const response = await axios.post('/api',newTransaction, {
                headers:{
                    authorization:token
                }
            });
            if(response.status === 200){
                setMsg('transaction added successfully')
                setError(false)
                const tempArray = [...transactions, response.data.savedData]
                setTransactions(tempArray)
                localStorage.setItem('transactions',JSON.stringify(tempArray))
            }
            else{
                setMsg('Transaction could not be added. Try again')
                setError(true)
            }
        }
        else{
            newTransaction.transaction_date = Date.now();
            newTransaction.story? newTransaction.story += '  (TRANSACTION DATE IS IMMUTABLE IN DEMO MODE)': newTransaction.story = 'TRANSACTION DATE IS IMMUTABLE IN DEMO MODE'
            newTransaction._id = Date.now()
            addGuest(newTransaction)
            setMsg('transaction added successfully')
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
                        addNewPostToDB(currentTransaction);
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
                    
                    // setModalOpen(false);
                }}>
                    <h1 className="modal-header">Add Transaction</h1>
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
                            defaultValue={type}
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

export default Modal
