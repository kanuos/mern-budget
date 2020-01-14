import React from 'react'
import {PieChart, Pie, Cell, Legend} from 'recharts';

const COLORS = ['var(--income)','var(--expense)','var(--edit)'] ;
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent, index,
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (
            <text x={x} y={y} fill="var(--grey)" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
            </text>
            );
    };


const Piechart = ({data, size=280}) => {
    return (
        <PieChart width={size} height={size} margin={5}>
            <Pie
                dataKey="value" 
                cx={size/2}
                cy={size/2}
                label={renderCustomizedLabel}
                outerRadius={size/2 - size/10}
                labelLine={false}
                data={data}
            >
            {data.map((item,index) =>
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                }
            </Pie>
            <Legend/>
        </PieChart>
    )
}

export default Piechart
