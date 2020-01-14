import React, {useEffect,useContext, useState} from 'react';
import './report.css'
import { TransactionContext } from '../../context/TransactionContext';
import Goal from './Goal';
import ReportModa from './ReportModa';
import ManageModal from './ManageModal';
import LineGraph from './Barchart';
import Piechart from './PieChart';

const DAYS_IN_MILI_SECONDS = 24*60*60*1000;

const Report = () => {

    const [totalIncome, setIncome] = useState()
    const [totalExpense, setExpense] = useState()
    const [defaultsaving, setSaving] = useState()
    const [duration, setDuration] = useState(1);
    const [durationMonths, setDurationMonths] = useState(1);
    const [modalOn, setModal] = useState(false)
    const [modalTnxOn, setModalTnx] = useState(false)
    
    const user = localStorage.getItem('currentUser');
    const {transactions} = useContext(TransactionContext);
        
    useEffect(()=>{
        let inc=0,exp = 0;
        transactions.forEach(element => {
            if (element.type ==='inc'){
                inc += element.amount;
            }
            else
                exp += element.amount;
        });
        setIncome(inc)
        setExpense(exp)
        let firstTnx = transactions[0];
        transactions.forEach(element =>{
            if ( element.transaction_date < firstTnx.transaction_date)
                firstTnx = element;
        })
        setDuration(Math.ceil((Date.now() - (firstTnx ? firstTnx.transaction_date : Date.now())))/DAYS_IN_MILI_SECONDS)
        
    },[transactions])
    
    
    useEffect(() => {
        setSaving(totalIncome - totalExpense)
    }, [totalExpense, totalIncome])


    useEffect(() => {
       setDurationMonths(Math.ceil(duration/30))
    }, [duration])



    return (
        <main className="report">
                <div className="report-wrapper">
                <h1 className="report-welcome">Hi {user},</h1>
                
                <div className="report-hero">
            {transactions.length<=0? <h1 className="report-heading--main">"No transactions found"</h1>    
            :
            <section className="report-main">
                    <div className="report-flex-box">
                        <h1 className="report-heading--main">
                            Financial report
                            <sub className="muted">Usage Period:{durationMonths} months</sub>
                        </h1>
                    </div>

                    <div className="report-flex-box">
                        <div className="report-data" id="element-1">
                            <h2 className="report-heading">Total Income : <span>${parseFloat(totalIncome).toFixed(2)}</span></h2>
                            <h2 className="report-heading">Total Expense : <span>${parseFloat(totalExpense).toFixed(2)}</span></h2>
                            {totalIncome > totalExpense ? <h2 className="report-heading">Total Saving : <span>${(totalIncome - totalExpense).toFixed(2)}</span></h2> : <h2 className="report-heading">Total Saving : <span>No saving</span></h2>}
                        </div>
                        <div className="graph-container" id="element-2">
                            <strong>Income and Expense Chart</strong>
                            <Piechart data ={[
                                    {name:'Income', value:totalIncome},
                                    {name:'Expense',value:totalExpense}]
                            }/>                
                        </div>
                    </div>

                    <div className="report-flex-box">
                        <div className="graph-container" id="element-3">
                            <strong>Total Income (income pattern)</strong>
                            <LineGraph
                                id="element-7"
                                 data={transactions.filter(item => item.type ==='inc')} type="inc" />
                        </div>
                        <div className="graph-container" id="element-4">
                            <strong>Total Expense (expense pattern)</strong>
                            <LineGraph
                                id="element-8" 
                                data={transactions.filter(item => item.type ==='exp')} type="exp"
                            />
                        </div>
                    </div>
                    
                    <div className="report-flex-box">
                        <div className="report-data" id="element-6">
                            <h2 className="report-heading">Average Income : <span>${parseFloat(totalIncome).toFixed(2)}</span></h2>
                            <h2 className="report-heading">Average Expense : <span>${parseFloat(totalExpense/durationMonths).toFixed(2)}</span></h2>
                            {totalIncome > totalExpense ? <h2 className="report-heading">Average Saving : <span>${parseFloat((totalIncome-totalExpense)/durationMonths).toFixed(2)}</span></h2> :
                            <h2 className="report-heading">Average Saving : <span>No saving</span></h2> }
                        </div>   
                        <div className="graph-container" id="element-5">
                            <strong>Total Income and Expense Chart</strong>
                            <Piechart data ={[
                                {name:'Avg Saving', value:(totalIncome-totalExpense)>0? (totalIncome -totalExpense)/durationMonths : 0},
                                {name:'Avg Expense',value:totalExpense/durationMonths}]}
                                />
                        </div>

                    </div>

                </section>}


                </div>

                {transactions.length>0 && <button 
                    className="open-modal open-modal--red"
                    onClick = {()=> {
                        setModal(true);
                        document.documentElement.querySelector('body').style.overflowY = 'hidden';
                    }}
                >
                    View Statement
                </button>}
                {transactions.length>0 && <button 
                    className="open-modal open-modal--green"
                    onClick = {()=> {
                        setModalTnx(true);
                        document.documentElement.querySelector('body').style.overflowY = 'hidden';
                    }}
                >
                    Manage Transactions
                </button>}
            
            {modalOn && <ReportModa close={setModal} data={transactions}/>}
            {modalTnxOn && <ManageModal close={setModalTnx} data={transactions}/>}
            <Goal 
                start={defaultsaving} 
                avgPercent = {(totalIncome - totalExpense)*100/totalIncome} 
                duration = {durationMonths}
            />
            </div>
        </main>
    )
}

export default Report
