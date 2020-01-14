import React, {useState, useEffect} from 'react';
import {AiOutlineUser, AiOutlineCalendar} from 'react-icons/ai';
import './report.css'

const calculateCompoundInterest = (bulk,perMonth, r, t) =>{
    const n = 4;    // compounding per year    
    const main = bulk * Math.pow((1 + (r/(n*100))), (n*t))
    let perMonthBlock = perMonth * Math.pow((1 + (r/(n*100))), (n*t)) - 1;
    perMonthBlock /= (r/(n*100));

    return Math.floor((main+perMonthBlock)*n)
}

const calculateRetirementIncome = (amt) =>{
    const CALCULATION_FACTOR = 266;    // compounding quarterly
    return Math.round(amt/CALCULATION_FACTOR)
}

const calculateLifeStyle = amt =>{
    if (amt >= 8000)
        return 'Comfortable'
    else if(amt>3000 && amt< 8000)   
        return 'Content'
    else    
        return 'Frugal'
}


const Goal = (props) => {
    const [start, setStart] = useState(25)
    const [end, setEnd] = useState(65)
    const [monthly, setMonthly] = useState()
    const [initial, setInitial] = useState(0)
    const [aggresive, setAggressive] = useState(0)
    const [conservative, setConservative] = useState(0)

    const [retirementAgg, setRetirementAgg] = useState(0)
    const [retirementCon, setRetirementCon] = useState(0)

    const [lifeAgg, setLifeAgg] = useState()
    const [lifeCon, setLifeCon] = useState()

    useEffect(()=>{
        props.start && setInitial(props.start)
    }, [props])
    
    useEffect(()=>{
        const time = parseInt(end - start)
        setAggressive(calculateCompoundInterest(initial,monthly,8.15,time));
        setConservative(calculateCompoundInterest(initial,monthly,5.15,time));

        setRetirementAgg(calculateRetirementIncome(aggresive));
        setRetirementCon(calculateRetirementIncome(conservative));

        setLifeAgg(calculateLifeStyle(calculateRetirementIncome(aggresive)))
        setLifeCon(calculateLifeStyle(calculateRetirementIncome(conservative)))

    },[monthly, initial, end, start, aggresive, conservative])


    return (
        <div className="goal-wrapper">
                <h1 className="goal-heading-main">Investment Calculator</h1>
            <h1 className="goal-heading">
                <span>Your age : {start} years</span>
                <span>Retirement age : {end} years</span>
            </h1>
            <div className="report-slider">
                <input 
                    multiple
                    type="range" 
                    step= "1"
                    min = "18"
                    max={end<64? end : 64}
                    value={start}
                    title={`${start} years old`}
                    onChange={(e) => {
                        setStart(parseInt(e.target.value))
                    }}    
                />       
                <input 
                    multiple
                    type="range" 
                    step= ".1"
                    min = {start>60 ? start : 60}
                    value={end}
                    max="70"
                    title={`${end} years old`}
                    onChange={(e) => {
                        setEnd(parseInt(e.target.value))
                    }}    
                />       
            </div>
            {/* the input amounts go here */}
            <div className="report-input-wrapper">
                <div className="report-box">
                    <label htmlFor="start">Initial bulk investment</label>
                    <input 
                        type="number" 
                        placeholder="Amount" 
                        id="start" 
                        value={initial>0 ? initial:0}
                        onChange={e =>{
                            console.log(e.target.value)
                            setInitial(parseFloat(e.target.value))
                    }}/>
                </div>
                <div className="report-box">
                    <label htmlFor="monthly">Monthly investment</label>
                    <input
                        type="number" 
                        placeholder="Amount" 
                        id="monthly"
                        min="0"
                        onChange={e =>{
                            setMonthly(parseFloat(e.target.value))
                    }}/>
                </div>
            </div>
            <section className="goal-result">
                <h2>Investment Plan</h2>
                <div className="blank"></div>
                <span className="report-head">
                    <AiOutlineUser /> Age {end}
                </span>
                <span className="report-head">
                    <AiOutlineCalendar/> Year {new Date().getFullYear() + end - start}
                </span>
                <span className="report-caption">Aggressive</span>
                <span className="report-caption">Conservative</span>
                <h4 className="report-bold">Investment Total:</h4>
                <em>${aggresive ? aggresive : initial}</em>
                <em>${conservative ? conservative : initial}</em>
              
                <h4 className="report-bold">Retirement Income:</h4>
                <em>${retirementAgg ? retirementAgg : 0}/mo</em>
                <em>${retirementCon ? retirementCon : 0}/mo</em>
              
                <h4 className="report-bold">Lifestyle Type:</h4>
                <em>{lifeAgg}</em>
                <em>{lifeCon}</em>
                    {retirementAgg>0 && retirementCon>0 ? 
                    <p>
                        Aggressive Investment of ${retirementAgg} is ${(Math.round((retirementAgg - retirementCon)*100/retirementAgg)||0)}% better than conservative investment of ${retirementCon}.
                        <br/>
                        Your current average saving is {`${initial/props.duration}`} at {`${Math.round(props.avgPercent)}`}% 
                        <br/><br/>
                        {monthly>0 && (monthly< (initial/props.duration) ? 
                            <span className="expense--text">
                                Monthly investment is less than your average saving by ${`${initial/props.duration - monthly}`} <br/>
                            </span> :
                            <span className="income--text">
                                You are saving ${`${monthly - initial/props.duration}`} more than the average. <br/>
                            </span>)}
                    </p>
                    :
                    <p>Enter monthly investment amount to calculate your goal.</p>
                    }
            </section>
        </div>
    )
}

export default Goal
