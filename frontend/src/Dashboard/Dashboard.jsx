import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Sector, Tooltip, XAxis, YAxis } from 'recharts';
import './Dashboard.css'
import { useEffect, useState } from 'react';


import { GetStatistics, GetDaysStatistics} from '../../wailsjs/go/database/Db'




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


    const [ stats, setStats] = useState({})

    const [ barGraphData, setBarGraphData] = useState( [])

    const pieData = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
    ];

    const [pieIndex, setPieIndex] = useState(null);

    const onPieEnter = (_, index) => setPieIndex( index);

    const onPieLeave = () => setPieIndex( null)


    // TODO: you don't need to pull from the database every time

    useEffect( () => {


      const weekDays = [
        'Lundi',
        'Mardi',
        'Mercredi',
        'jeudi',
        'Vendredi',
        'Samedi',
        'Dimanche' 
      ]


      // need to get overall statistics and get the current week's statistics
      GetStatistics().then( 
        (res) => {

          setStats( prev => res)

          GetDaysStatistics( res.WeekId).then(
            (res) => {

              setBarGraphData( prev => {                  
                  let data = []
                  for (let i=0; i<res.length; i++) {
                    data.push({ day: res[i].Day, production: res[i].Prod, consumption: res[i].Cons})
                  }

                  const l = res.length

                  for (let i=l; i<7; i++){
                    data.push( { day: weekDays[i], production: 0, consumption: 0})
                  }

                  return data
                }
              )
            }
          ).catch( (e) => console.log(e))
        }
      ).catch( (e) => {
        console.log("DASHBOARD: ", e)
      })

    }, [])

    return (
        <div className="Dashboard">
            {/* This is a chart to show time spent working using the app */}
            <div className="TimeSpentProdCons">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={barGraphData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="consumption" stackId="a" fill="#8884d8" />
                        <Bar dataKey="production" stackId="a" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="TimeSpentActivity">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={barGraphData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="consumption" stackId="a" fill="#8884d8" />
                        <Bar dataKey="production" stackId="a" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="LastResource">
                <p>Vous êtes à jour</p>
            </div>
            <div className="tasks">
              <div className="taskState todoState">
                <div className="taskStateColor todoStateColor"></div>
                <h3> <span>{stats.Todo}</span> Tasks to start</h3>
              </div>
              <div className="taskState inProgressState">
                <div className="taskStateColor inProgressStateColor"></div>
                <h3><span>{stats.InProgress}</span> Tasks to complete</h3>
              </div>
              <div className="taskState doneState">
                <div className="taskStateColor doneStateColor"></div>
                <h3> <span>{stats.Done}</span> are done</h3>
              </div>
              <div className="taskState holdState">
                <div className="taskStateColor holdStateColor"></div>
                <h3><span>{stats.Hold}</span> tasks on hold</h3>
              </div>
              <div className="taskAction">
                <button onClick={() => gotoTasks()}>plus</button>
              </div>
            </div>
        </div>
    );

}


export default Dashboard; 

