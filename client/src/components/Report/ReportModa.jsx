import React, {useState} from 'react';
import './report.css';
import Piechart from './PieChart';
import {timeStampToDateString} from '../Input-validation'

const getDateRange = () =>{
    const today = new Date();
    let firstDay = 1, lastDay;
    const currentMonth = today.getUTCMonth();
    const year = today.getUTCFullYear();
    switch(currentMonth){
        case 1: {
            lastDay = 28;
            break;
        }
        case 0:
        case 2:
        case 4:
        case 6:
        case 7:
        case 9:
        case 11:{
            lastDay = 31;
            break;
        }
        default: lastDay = 30;
    }
    return{
        first:Date.parse(`${year}-${currentMonth+1}-${firstDay}`),
        last:Date.parse(`${year}-${currentMonth+1}-${lastDay}`)   }
}


const month = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER']

const ReportModa = ({data,close}) => {

    const [startDate, setStartDate] = useState((getDateRange().first));
    const [endDate, setEndDate] = useState((getDateRange().last));
    
    const [message, setMessage] = useState(`Transactions for ${month[new Date().getUTCMonth()]}, ${new Date().getUTCFullYear()}`);

    const [transactions, setTransactions] = useState(data.filter(element => element.transaction_date>=startDate && element.transaction_date <=endDate))

    const [income, setIncome] = useState(transactions.filter(item => item.type ==='inc'))
    const [expense, setExpense] = useState(transactions.filter(item => item.type==='exp'))
    
    const totalIncome = income.reduce((acc,cur)=>acc+cur.amount,0)
    const totalExpense = expense.reduce((acc,cur)=>acc+cur.amount,0)
    

    React.useEffect(()=>{
        console.log('Start date', startDate)
        console.log('End date', endDate)
    },[startDate, endDate])


    return (
        <div className="report-modal">
            <section className="report-container">
            <span
                className="close-report-modal" 
                onClick={()=>{
                close(false)
                document.documentElement.querySelector('body').style.overflowY = 'scroll'
            }}>
                     &times;
            </span>
            <h2 className="report-message">{message}</h2>
            
            <section className="graph-container" id="report-modal-1">
                <Piechart 
                data = {[
                        {name:'Income', value:totalIncome},{name:'Expense',value:totalExpense}
                        ]}
                size={180}/>
            </section>
            
            <section className="report-month">
                <h1>
                    Total Income = {income.reduce((prev,cur)=> prev + cur.amount, 0)}
                </h1>
                <h1>
                    Total Expense = {expense.reduce((acc,cur)=>acc+cur.amount,0)}
                </h1>
                    <em>Total Income Entries : {income.length}</em>
                    <em>Total Expense Entries : {expense.length}</em>
                <form
                    className="report-form"
                    onSubmit = {e =>{
                        e.preventDefault();
                        const start = startDate;
                        const end = endDate;
                        if(end<start){
                            setMessage('Invalid Date')
                        }
                        else{
                            const transactions = data.filter(element => element.transaction_date>=start && element.transaction_date <=end)
                            setTransactions(transactions)
                            setIncome(transactions.filter(item => item.type ==='inc'))
                            setExpense(transactions.filter(item => item.type ==='exp'))
                        }
                    }}>
                    <input 
                        type="date"
                        placeholder='Start date'
                        value={timeStampToDateString(startDate).date}
                        onChange={e =>{setStartDate(Date.parse(e.target.value)); setMessage()
                        }}
                    />
                    <input 
                        type="date"
                        value={timeStampToDateString(endDate).date}
                        placeholder='End date'
                        onChange={e =>{setEndDate(Date.parse(e.target.value)); setMessage()
                        }}
                />
                <button type="submit">Search</button>
                </form>
            </section>
            
            <ul className="report-statement">
                        {transactions.map(element =>(
                            element.type ==='inc' ? 
                            <li key={element._id} className="statement-entry income-entry">
                                <strong>{element.narration}</strong>
                                <strong>{element.amount}</strong>
                                <p>{element.story ? element.story: 'No description available'}</p>
                                <sub>Transaction Date: {timeStampToDateString(element.transaction_date)}</sub>
                            </li>
                            :
                            <li key={element._id} className="statement-entry expense-entry">
                                <strong>{element.narration}</strong>
                                <strong>{element.amount}</strong>
                                 <p>{element.story>0 ? element.story: 'No description available'}</p>
                                 <sub>Transaction Date: {timeStampToDateString(element.transaction_date)}</sub>
                            </li>
                        ))}
                </ul>
            </section>
            
        </div>
    )
}

export default ReportModa
