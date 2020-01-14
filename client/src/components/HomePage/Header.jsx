import React,{useState, useContext, useEffect} from 'react'
import './home.css';
import { TransactionContext } from '../../context/TransactionContext';
import {GuestContext} from '../../context/GuestContext'

const Header = ({startDate}) => {

    const user = localStorage.getItem('currentUser');
    const [income, setIncome] = useState([])
    const [expense, setExpense] = useState([])
    const {transactions} = useContext(TransactionContext)
    const {guestTransactions} = useContext(GuestContext)

    const budgetForTheMonthOf = () =>{
        const date = new Date();
        const year = date.getFullYear()
        const month = date.getMonth();

        switch(month){
            case 0: return `January,${year}`
            case 1: return `February,${year}`
            case 2: return `March,${year}`
            case 3: return `April,${year}`
            case 4: return `May,${year}`
            case 5: return `June,${year}`
            case 6: return `July,${year}`
            case 7: return `August,${year}`
            case 8: return `September,${year}`
            case 9: return `October,${year}`
            case 10: return `November,${year}`
            default: return `December,${year}`
        }
    }
   
    useEffect(()=>{
        if(transactions.length){
            const totalIncome = transactions.filter(item => item.type==='inc'&& item.transaction_date>= startDate);
            const totalExpense = transactions.filter(item => item.type==='exp'&& item.transaction_date>=startDate);
            setIncome(totalIncome)
            setExpense(totalExpense)
        }
        else{
            const totalIncome = guestTransactions.filter(item => item.type ==='inc')
            const totalExpense = guestTransactions.filter(item => item.type ==='exp')
            setIncome(totalIncome)
            setExpense(totalExpense)
        }
    },[transactions, startDate, guestTransactions])


    return (
        <header className="home-header">
            <div className="header-wrapper">
                <h1 className="header-heading">
                    {user ? user : 'Guest'}'s Budget : {transactions.length>0 ? parseFloat((
            (transactions.filter(el =>el.type==='inc'&&el.transaction_date>=startDate)).reduce((acc,cur)=> acc+cur.amount,0) - (transactions.filter(el =>el.type==='exp'&&el.transaction_date>=startDate)).reduce((acc,cur)=> acc+cur.amount,0)
        )).toFixed(2) :parseFloat((
            (guestTransactions.filter(el =>el.type==='inc')).reduce((acc,cur)=> acc+cur.amount,0) - (guestTransactions.filter(el =>el.type==='exp')).reduce((acc,cur)=> acc+cur.amount,0)
        )).toFixed(2) }</h1>
                <span className="muted">For the month of {budgetForTheMonthOf()}</span>
                <section className="header-box">
                    <div className="header-box-line income">
                        <span className="header-caption">Income</span>
                        <span className="header-caption">{income.reduce((acc,cur)=>acc+cur.amount,0).toFixed(2)}</span>
                    </div>
                    <div className="header-box-line expense">
                        <span className="header-caption">Expense</span>
                        <span className="header-caption">{expense.reduce((acc,cur)=>acc+cur.amount,0).toFixed(2)}</span>
                    </div>
                </section>
            </div>
        </header>
    )
}

export default Header
