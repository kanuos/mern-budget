import React from 'react';
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid} from 'recharts'

const LineGraph = ({type, data}) => {
    
    let color = 'var(--expense)';
    let icon = 'triangle';
    let tnxType = 'Expense';

    if(type){
        switch(type){
            case 'inc': color = 'var(--income)';icon="square";tnxType="income"; break;
            default: color= 'var(--expense)'; break; 
        }
    }
    return (
        <>
            { data && 
                <LineChart
                width={400}
                height={300}
                data={data}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="amount" stroke="var(--grey)" />
                <YAxis dataKey="amount" stroke="var(--grey)"/>
                <Tooltip/>
                <Legend iconSize={13} iconType={icon}/>
                <Line dataKey="amount" name={tnxType} stroke={color} type="monotone"/>
            </LineChart>}
        </>
    )
}

export default LineGraph
