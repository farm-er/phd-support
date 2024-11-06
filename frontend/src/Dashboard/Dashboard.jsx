import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Sector, Tooltip, XAxis, YAxis } from 'recharts';
import './Dashboard.css'
import { useState } from 'react';

import UptoDate from '../assets/images/uptodate.gif'
import Unfinished from '../assets/images/unfinished.gif'





const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
  
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };





const Dashboard = ({gotoTasks}) => {


    const data = [
        {
          name: 'Lundi',
          production: 4000,
          consommation: 2400,
        },
        {
          name: 'Mardi',
          production: 4000,
          consommation: 2400,
        },
        {
          name: 'Mercredi',
          production: 4000,
          consommation: 2400,
        },
        {
          name: 'Jeudi',
          production: 4000,
          consommation: 2400,
        },
        {
          name: 'Vendredi',
          production: 4000,
          consommation: 2400,
        },
        {
          name: 'Samedi',
          production: 4000,
          consommation: 2400,
        },
        {
          name: 'Dimanche',
          production: 4000,
          consommation: 2400,
        },
    ];

    const pieData = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
    ];

    const [pieIndex, setPieIndex] = useState(null);

    const onPieEnter = (_, index) => {
    setPieIndex( index);
    };

    const onPieLeave = () => {
    setPieIndex( null)
    }

    return (
        <div className="Dashboard">
            <div className="WordCount" style={{overflow:'visible'}}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={400} height={400}>
                        <Pie
                            activeIndex={pieIndex}
                            activeShape={renderActiveShape}
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                            onMouseLeave={onPieLeave}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            {/* This is a chart to show time spent working using the app */}
            <div className="TimeSpent">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="consommation" stackId="a" fill="#8884d8" />
                        <Bar dataKey="production" stackId="a" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="LastResource">
                <p>Vous êtes à jour</p>
                <img src={UptoDate} alt="" />
            </div>
            <div className="tasks">
                <div className="task">
                    <h3>Task title or name</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum consectetur dolor earum ipsam nisi dolorum praesentium assumenda facilis veritatis sit.</p>
                    <button onClick={() => gotoTasks()}>Entrer</button>
                </div>
                <img src={Unfinished} alt="" />
            </div>
        </div>
    );

}


export default Dashboard; 

