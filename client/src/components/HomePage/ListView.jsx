import React, {useState, useContext} from 'react';
import {TiDelete} from 'react-icons/ti';
import './home.css';
import Modal from './AddModal';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import { TransactionContext } from '../../context/TransactionContext';
import { GuestContext } from '../../context/GuestContext'


const ListView = ({startDate}) => {

const {transactions} = useContext(TransactionContext)
const {guestTransactions} = useContext(GuestContext);

const [incomes, setIncome] = useState([])
const [expenses, setExpense] = useState([])

    // setIncome(transactions.length>0 && transactions.filter(element =>{
    //     return element.type  === 'inc' && element.transaction_date >= startDate
    // }))
    // setExpense(transactions.length>0 && transactions.filter(element =>{
    //     return element.type  === 'exp' && element.transaction_date >= startDate
    // }))


const [modalOpen, setModalOpen] = useState(false);
const [listModalOpen, setListModalOpen] = useState(false);
// for the data to be passed to edit modal
const [amount, setAmount] = useState()
const [type, setType] = useState()
const [narration, setNarration] = useState()
const [story, setStory] = useState()
const [date,setDate] = useState()
const [id,setID] = useState()
const [deleteBox, setDelete] = useState(false) 

React.useEffect(()=>{
    if(transactions.length >0){
        setIncome(transactions.filter(item => item.type==='inc' && item.transaction_date>=startDate))
        setExpense(transactions.filter(item => item.type==='exp' && item.transaction_date>=startDate))
    }else{
        setIncome(guestTransactions.filter(item => item.type==='inc'))
        setExpense(guestTransactions.filter(item => item.type==='exp'))
    }
},[transactions, startDate, guestTransactions])

React.useEffect(()=>{
    if(transactions){
        setIncome(transactions.filter(item => item.type==='inc' && item.transaction_date>=startDate))
        setExpense(transactions.filter(item => item.type==='exp' && item.transaction_date>=startDate))
    }else{
        setIncome(guestTransactions.filter(item => item.type==='inc'))
        setExpense(guestTransactions.filter(item => item.type==='exp'))
    }
},[guestTransactions, transactions, startDate])


    return (
        <main className="list-container">
            <button
                className="addtransaction-btn"
                onClick = {()=>{
                    setModalOpen(true)
                }}
            >Add New Transaction</button>
            { modalOpen && 
                <Modal 
                    setModalOpen = {setModalOpen} 
                    modalOpen = {modalOpen}
                />}
            {listModalOpen && 
                <EditModal 
                    setModalOpen={setListModalOpen} 
                    modalOpen={listModalOpen} 
                    amount = {amount} 
                    type={type} 
                    narration={narration} 
                    story={story}
                    date = {date}
                    id = {id}
                />
            }

                { !(incomes.length===0 && expenses.length===0) ?
                <section className="list-wrapper">
                <ul className="list-block">
                    <h1 className="list-description">Income</h1>
                    {incomes.map( income => (
                        <li className="list-entry" key={income._id} title="Click to edit">
                           <div 
                            className="list-line"
                            onClick = {()=>{
                                setAmount(income.amount)
                                setType('inc')
                                setNarration(income.narration)
                                setID(income._id)
                                setStory(income.story)
                                setDate(income.transaction_date)
                                setListModalOpen(true)
                            }}
                            >
                                <span className="list-entry-text">{income.narration}</span>
                                <span className="list-entry-text income-text">{income.amount.toFixed(2)}</span>
                           </div>
                            <TiDelete 
                                className="entry-cancel" 
                                title="Delete Entry"
                                onClick = {()=>{setDelete(true); setID(income._id)}}/>
                        </li>
                    ))}
                </ul>
                <ul className="list-block">
                    <h1 className="list-description">Expense</h1>
                    {expenses.map( expense=> (
                        <li className="list-entry" key={expense._id} title="Click to edit">
                            <div 
                                className="list-line"
                                onClick = {()=>{
                                    setAmount(expense.amount)
                                    setType('exp')
                                    setNarration(expense.narration)
                                    setID(expense._id)
                                    setStory(expense.story)
                                    setDate(expense.transaction_date)
                                    setListModalOpen(true)
                                }}
                            >
                                <span className="list-entry-text">{expense.narration}</span>
                                <span className="list-entry-text expense-text">{expense.amount.toFixed(2)}</span>
                            </div>
                            <TiDelete 
                                className="entry-cancel" 
                                title="Delete Entry"
                                onClick = {()=>{setDelete(true); setID(expense._id)}}/>
                        </li>
                    ))}
                </ul>
            </section> : 
            <h1 className="list-none">No transactions for the current month</h1> 
            }
            {deleteBox && <DeleteModal id={id} setModalOpen={setDelete} />}
        </main>
    )
}

export default ListView
