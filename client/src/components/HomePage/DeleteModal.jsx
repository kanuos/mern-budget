import React, {useState,useContext} from 'react'
import { TransactionContext } from '../../context/TransactionContext';
import {GuestContext} from '../../context/GuestContext'
import Axios from 'axios'
import './home.css'


const DEFAULT_MESSAGE = 'Are you sure you want to delete this entry?'
// const transactionsDB = JSON.parse(localStorage.getItem('transactions'))

const DeleteModal = ({id, setModalOpen}) => {
    const [confirm, setConfirm] = useState(false);
    const [message, setMessage] = useState(DEFAULT_MESSAGE)
    const {transactions, setTransactions} = useContext(TransactionContext);
    const {removeGuest} = useContext(GuestContext);

    const deleteEntry = (t_id) =>{   
        const token = localStorage.getItem('DB_auth');
        
        const asyncDelete = async (ID, token) =>{
            const response = await Axios.delete(`/api/${ID}`,{
                headers: {
                    authorization:token
                }})
                if(response.status === 200){
                    const filteredArray = transactions.filter(item =>{
                        return item._id !== ID
                    })
                    setTransactions([...filteredArray])
                    localStorage.setItem('transactions', JSON.stringify(filteredArray))
                    setMessage(response.data.message)
                }
            }      
            if(token){
                asyncDelete(t_id, token)
            }else{
                // Guest user
                removeGuest(id);
            }
        }

    return (
        <div className="delete-modal">
            <form 
                className="delete-box"
                onSubmit={(e)=>{
                    e.preventDefault();                   
                    deleteEntry(id);
                    setConfirm(true)
                    setTimeout(()=>{
                        setConfirm(true)
                        setModalOpen(false)
                    },500)
                    document.querySelector('body').style.overflowY = 'scroll';
                }}>
                {message && <h1 className="delete-header">{message}</h1>}
                {!confirm && <div className="delete-btn-box">
                    <button className="delete-btn btn-danger" type="submit">Yes</button>
                    <button className="delete-btn btn-cancel" type="reset"
                        onClick={()=>{
                            setModalOpen(false)
                        }}
                     >No
                    </button>
                </div>}
            </form>
        </div>
    )
}

export default DeleteModal
