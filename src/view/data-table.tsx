import React, { createContext, FC } from 'react'
import { useGetAverage } from '../util/get-average'
import { useResolve } from '../util/use-resolve'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  Bar, BarChart, ZAxis, Scatter, LabelList, ComposedChart
} from 'recharts'

type TableValues = Array<(string | number)>

export interface DataTableProps {
  averagePeriod: number
  values: TableValues[]
}

const DataTable: FC<DataTableProps> = (props) => {
  const getAverage = useResolve(useGetAverage)

  const values = props.values.slice(0, props.averagePeriod)
  const stats = getAverage(props.averagePeriod, values)

  const longAverage = stats(1)
  const shortAverage = stats(2)
  const longPercentageAverage = stats(5).average.toLocaleString()
  const shortPercentageAverage = stats(6).average.toLocaleString()

  const changeLongsStats = stats(3)
  const changeShortsStats = stats(4)
  const netPosStats = stats(7)
  const netSentimentStats = stats(20)
  const longSentimentStats = stats(8)
  const shortSentimentStats = stats(9)
  const spreadSentimentStats = stats(10)
  const longAvgPosStats = stats(11)
  const shortAvgPosStats = stats(12)

  const largeSpecNetLongStats = stats(13)
  const largeSpecNetShortStats = stats(14)
  const largeSpecGrossLongStats = stats(15)
  const largeSpecGrossShortStats = stats(16)

  const netAverage = netPosStats.average.toLocaleString()

  const mappedData = values
    .map((x, idx) => ({
      date: x[0],
      longs: {
        val: x[1],
        prev_val: values[idx + 1]?.[1],
        className: '',
      },
      longs_z_index: Math.round(((Number(x[1]) - longAverage.min) / (longAverage.max - longAverage.min) * 100)),
      shorts: {
        val: x[2],
        prev_val: values[idx + 1]?.[2],
        className: '',
      },
      shorts_z_index: Math.round(((Number(x[2]) - shortAverage.min) / (shortAverage.max - shortAverage.min) * 100)),
      change_longs: x[3],
      change_longs_std: Number(x[3]) < 0
        ? (-1 * (Number(x[3]) - changeLongsStats.std_dev.mean_negative) / changeLongsStats.std_dev.std_dev_negative).toFixed(2)
        : ((Number(x[3]) - changeLongsStats.std_dev.mean_positive) / changeLongsStats.std_dev.std_dev_positive).toFixed(2),
      change_longs_z_index: ((Number(x[3]) - changeLongsStats.min) / (changeLongsStats.max - changeLongsStats.min) * 100).toFixed(2),
      change_shorts: x[4],
      change_shorts_std: Number(x[4]) < 0
        ? (-1 * (Number(x[4]) - changeShortsStats.std_dev.mean_negative) / changeShortsStats.std_dev.std_dev_negative).toFixed(2)
        : ((Number(x[4]) - changeShortsStats.std_dev.mean_positive) / changeShortsStats.std_dev.std_dev_positive).toFixed(2),
      change_shorts_z_index: ((Number(x[4]) - changeShortsStats.min) / (changeShortsStats.max - changeShortsStats.min) * 100).toFixed(2),
      perc_longs: x[5],
      perc_shorts: x[6],
      long_sentiment: Number(x[8]).toFixed(2),
      long_sentiment_z_index: ((Number(x[8]) - longSentimentStats.min) / (longSentimentStats.max - longSentimentStats.min) * 100).toFixed(2),
      short_sentiment: Number(x[9]).toFixed(2),
      short_sentiment_z_index: ((Number(x[9]) - shortSentimentStats.min) / (shortSentimentStats.max - shortSentimentStats.min) * 100).toFixed(2),
      spread_sentiment: Number(x[10]).toFixed(2),
      spread_sentiment_z_index: ((Number(x[10]) - spreadSentimentStats.min) / (spreadSentimentStats.max - spreadSentimentStats.min) * 100).toFixed(2),
      avg_long_pos: x[11],
      avg_short_pos: x[12],
      long_avg_z_index: Math.round(100 * ((Number(x[11]) - longAvgPosStats.min) / (longAvgPosStats.max - longAvgPosStats.min))),
      short_avg_z_index: Math.round(100 * ((Number(x[12]) - shortAvgPosStats.min) / (shortAvgPosStats.max - shortAvgPosStats.min))),
      large_spec_net_long: x[13],
      large_spec_net_long_z_index: ((Number(x[13]) - largeSpecNetLongStats.min) / (largeSpecNetLongStats.max - largeSpecNetLongStats.min) * 100).toFixed(2),
      large_spec_net_short: x[14],
      large_spec_net_short_z_index: ((Number(x[14]) - largeSpecNetShortStats.min) / (largeSpecNetShortStats.max - largeSpecNetShortStats.min) * 100).toFixed(2),
      large_spec_gross_long: x[15],
      large_spec_gross_long_z_index: ((Number(x[15]) - largeSpecGrossLongStats.min) / (largeSpecGrossLongStats.max - largeSpecGrossLongStats.min) * 100).toFixed(2),
      large_spec_gross_short: x[16],
      large_spec_gross_short_z_index: ((Number(x[16]) - largeSpecGrossShortStats.min) / (largeSpecGrossShortStats.max - largeSpecGrossShortStats.min) * 100).toFixed(2),
      net_pos: {
        val: x[7],
        prev_val: values[idx + 1]?.[7],
        className: '',
      },
      net_pos_z_index: ((Number(x[7]) - netPosStats.min) / (netPosStats.max - netPosStats.min) * 100).toFixed(2),
      net_sentiment_z_index: ((Number(x[20]) - netSentimentStats.min) / (netSentimentStats.max - netSentimentStats.min) * 100).toFixed(2),
      long_traders: Number(x[17]),
      short_traders: Number(x[18]),
    }))
    .map(y => {
      if (y.longs.prev_val !== undefined) {
        if (y.longs.prev_val > y.longs.val) y.longs.className = 'column-negative'
        if (y.longs.prev_val < y.longs.val) y.longs.className = 'column-positive'
      }
      if (y.shorts.prev_val !== undefined) {
        if (y.shorts.prev_val > y.shorts.val) y.shorts.className = 'column-negative'
        if (y.shorts.prev_val < y.shorts.val) y.shorts.className = 'column-positive'
      }
      if (y.net_pos.prev_val !== undefined) {
        if (y.net_pos.prev_val > y.net_pos.val) y.net_pos.className = 'column-negative'
        if (y.net_pos.prev_val < y.net_pos.val) y.net_pos.className = 'column-positive'
      }
      return y
    })

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const max_weeks_in_charts = 16

  const sentimentData = [...mappedData].reverse().map((p, idx) => ({
    primary: String(p.date).substring(5),
    short_sentiment_z_index: Number(p.short_sentiment_z_index),
    long_sentiment_z_index: Number(p.long_sentiment_z_index),
    spreads_sentiment_z_index: Number(p.spread_sentiment_z_index),
    longs: p.long_sentiment,
    shorts: p.short_sentiment,
    spreads: p.spread_sentiment,
    net_sentiment: Number(p.net_sentiment_z_index),
  }))
  const netPositionsData = [...mappedData].reverse().map((p, idx) => ({
    primary: String(p.date).substring(5),
    net_positions: Number(p.net_pos_z_index),
  }))
  const avgPositionsData = [...mappedData].reverse().map((p, idx) => ({
    primary: String(p.date).substring(5),
    shorts: Number(p.avg_short_pos),
    longs: Number(p.avg_long_pos),
    long_avg_z_index: p.long_avg_z_index,
    short_avg_z_index: p.short_avg_z_index,
  }))
  const changeInOpenInterest = mappedData.slice(0, max_weeks_in_charts).reverse().map((p, idx) => ({
    primary: String(p.date).substring(5),
    change_longs_z_index: p.change_longs_z_index,
    change_shorts_z_index: p.change_shorts_z_index,
    change_longs_std: 100 * Number(p.change_longs_std),
    change_shorts_std: 100 * Number(p.change_shorts_std),
  }))
  const largeSpecsNetPositions = mappedData.slice(0, max_weeks_in_charts).reverse().map((p, idx) => ({
    primary: String(p.date).substring(5),
    change_longs_z_index: Number(p.large_spec_net_long_z_index),
    change_shorts_z_index: Number(p.large_spec_net_short_z_index),
  }))
  const largeSpecsGrossPositions = mappedData.slice(0, max_weeks_in_charts).reverse().map((p, idx) => ({
    primary: String(p.date).substring(5),
    change_longs_z_index: Number(p.large_spec_gross_long_z_index),
    change_shorts_z_index: Number(p.large_spec_gross_short_z_index),
  }))
  const longScatterData = mappedData.slice(0, props.averagePeriod).map((p, idx) => ({
    primary: String(p.date).substring(5),
    current: idx === 0 ? 'NOW' : null,
    avg_position: Math.round(p.long_avg_z_index),
    traders: Math.round(p.long_traders),
    oi: Math.round(p.longs_z_index),
  }))
  const shortScatterData = mappedData.slice(0, props.averagePeriod).map((p, idx) => ({
    primary: String(p.date).substring(5),
    current: idx === 0 ? 'NOW' : null,
    avg_position: Math.round(p.short_avg_z_index),
    traders: Math.round(p.short_traders),
    oi: Math.round(p.shorts_z_index),
  }))
  // const scatterAvgSizes = [
  //   ...longScatterData.map(u => u.avg_position),
  //   ...shortScatterData.map(u => u.avg_position),
  // ]
  // const scatterAvgSizeRange = [
  //   Math.min(...scatterAvgSizes),
  //   Math.max(...scatterAvgSizes),
  // ]
  console.debug('')

  return (
    <>
      <table
        className="table table-bordered text-center"
        style={{ marginTop: 10 }}>
      <thead className="thead-dark">
        <tr>
          <th scope="col">DATE</th>
          <th scope="col">LONG</th>
          <th scope="col">SHORT</th>
          <th scope="col">CHANGE LONG</th>
          <th scope="col">CHANGE SHORT</th>
          <th scope="col">% LONG</th>
          <th scope="col">% SHORT</th>
          <th scope="col">LONG SENTIMENT</th>
          <th scope="col">SHORT SENTIMENT</th>
          <th scope="col">NET POSITIONS</th>
        </tr>
      </thead>
      <tbody>
        {values.length >= props.averagePeriod && (
          <tr className="bg-light">
            <td title={`${props.averagePeriod} Period Simple Average`}>
              Average({props.averagePeriod})
            </td>
            <td>{longAverage.average.toLocaleString()}</td>
            <td>{shortAverage.average.toLocaleString()}</td>
            <td colSpan={2}></td>
            <td>{longPercentageAverage} %</td>
            <td>{shortPercentageAverage} %</td>
            <td colSpan={2}></td>
            <td>{netAverage}</td>
          </tr>
        )}
        {mappedData.slice(0, max_weeks_in_charts).map((row, rowIndex) => (
          <tr key={rowIndex}>
            <td key="date">
              {row.date}
            </td>
            <td className={row.longs.className} key="longs">
              {Number.isNaN(row.longs.val) ? 'Not Available' : row.longs.val.toLocaleString()}
            </td>
            <td className={row.shorts.className} key="shorts">
              {Number.isNaN(row.shorts.val) ? 'Not Available' : row.shorts.val.toLocaleString()}
            </td>
            <td key="change_longs">
              <span style={{ display: 'block' }}>{Number.isNaN(row.change_longs) ? 'Not Available' : row.change_longs.toLocaleString()}</span>
              {/* <span style={{ fontSize: '80%' }}>STD. {Number.isNaN(row.change_longs_std) ? 'Not Available' : `${row.change_longs_std}`}</span> */}
            </td>
            <td key="change_shorts">
              <span style={{ display: 'block' }}>{Number.isNaN(row.change_shorts) ? 'Not Available' : row.change_shorts.toLocaleString()}</span>
              {/* <span style={{ fontSize: '80%' }}>STD. {Number.isNaN(row.change_shorts_std) ? 'Not Available' : `${row.change_shorts_std}`}</span> */}
            </td>
            <td key="perc_longs">
              {Number.isNaN(row.perc_longs) ? 'Not Available' : `${row.perc_longs} %`}
            </td>
            <td key="perc_shorts">
              {Number.isNaN(row.perc_shorts) ? 'Not Available' : `${row.perc_shorts} %`}
            </td>
            <td key="sentiment_longs">
              <span style={{ display: 'block' }}>{Number.isNaN(row.long_sentiment_z_index) ? 'Not Available' : `${row.long_sentiment_z_index} out of 100`}</span>
              {/* <span style={{ display: 'block' }}>{Number.isNaN(row.long_sentiment) ? 'Not Available' : `${row.long_sentiment} %`}</span> */}
              {/* <span style={{ fontSize: '80%' }}>Z-score {Number.isNaN(row.long_sentiment_z_index) ? 'Not Available' : `${row.long_sentiment_z_index} %`}</span> */}
            </td>
            <td key="sentiment_shorts">
              <span style={{ display: 'block' }}>{Number.isNaN(row.short_sentiment_z_index) ? 'Not Available' : `${row.short_sentiment_z_index} out of 100`}</span>
              {/* <span style={{ display: 'block' }}>{Number.isNaN(row.short_sentiment) ? 'Not Available' : `${row.short_sentiment} %`}</span> */}
              {/* <span style={{ fontSize: '80%' }}>Z-score {Number.isNaN(row.short_sentiment_z_index) ? 'Not Available' : `${row.short_sentiment_z_index} %`}</span> */}
            </td>
            <td className={row.net_pos.className} key="net_pos">
              <span style={{ display: 'block' }}>{Number.isNaN(row.net_pos.val) ? 'Not Available' : row.net_pos.val.toLocaleString()}</span>
              {/* <span style={{ fontSize: '80%' }}>Z-score {Number.isNaN(row.net_pos_z_index) ? 'Not Available' : `${row.net_pos_z_index} %`}</span> */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

      <header className='blog-header py-4'>
        <div className='row flex-nowrap justify-content-between align-items-center'>
          <div className='col-12'>
            <h4>Net Sentiment Z-score</h4>
            <div className="container" style={{ width: '100%', height: '400px' }}>
              <LineChart width={1080} height={400} data={sentimentData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }} >
                <Line name="Net sentiment" activeDot={{ r: 8 }} type="monotone" dataKey="net_sentiment" stroke="#0000FF" />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis textAnchor="end" dataKey="primary" height={50} angle={-85} />
                <ReferenceLine y={50} stroke="red" />
                <YAxis />
                <Tooltip />
                <Legend wrapperStyle={{ bottom: 'auto' }} />
              </LineChart>
            </div>
          </div>
        </div>
      </header>

      <header className='blog-header py-4'>
        <div className='row flex-nowrap justify-content-between align-items-center'>
          <div className='col-6'>
            <h4>Sentiment Z-score</h4>
            <div className="container" style={{ width: '100%', height: '400px' }}>
              <LineChart width={540} height={350} data={
                [...sentimentData].reverse().slice(0, max_weeks_in_charts).reverse()
              } margin={{ top: 5, right: 10, bottom: 0, left: 0 }} >
                <Line name="Longs" activeDot={{ r: 8 }} type="monotone" dataKey="long_sentiment_z_index" stroke="#008080" />
                <Line name="Shorts" activeDot={{ r: 8 }} type="monotone" dataKey="short_sentiment_z_index" stroke="#800000" />
                <Line name="Spreads" activeDot={{ r: 8 }} type="monotone" dataKey="spreads_sentiment_z_index" stroke="#FFA500" />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis textAnchor="end" dataKey="primary" height={50} angle={-55} />
                <YAxis />
                <Tooltip />
                <Legend wrapperStyle={{ bottom: 'auto' }} />
              </LineChart>
            </div>
          </div>
          <div className='col-6'>
            <h4>Sentiment</h4>
            <div className="container" style={{ width: '100%', height: '400px' }}>
              <BarChart width={540} height={350} data={
                [...sentimentData].reverse().slice(0, max_weeks_in_charts).reverse()
              } margin={{ top: 5, right: 10, bottom: 0, left: 0 }} >
                <Bar name="Longs" stackId="a" dataKey="longs" fill="#008080" />
                <Bar name="Shorts" stackId="b" dataKey="shorts" fill="#800000" />
                <Bar name="Spreads" stackId="c" dataKey="spreads" fill="#FFA500" />
                <XAxis textAnchor="end" dataKey="primary" height={50} angle={-55} />
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis />
                <Tooltip />
                <Legend wrapperStyle={{ bottom: 'auto' }} />
              </BarChart>
            </div>
          </div>
        </div>
      </header>

      <header className='blog-header py-4'>
        <div className='row flex-nowrap justify-content-between align-items-center'>
          <div className='col-12'>
            <h4>Net Positions Z-score</h4>
            <div className="container" style={{ width: '100%', height: '400px' }}>
              <LineChart width={1080} height={400} data={netPositionsData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }} >
                <Line name="Net positions" activeDot={{ r: 8 }} type="monotone" dataKey="net_positions" stroke="#0000FF" />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis textAnchor="end" dataKey="primary" height={50} angle={-85} />
                <ReferenceLine y={50} stroke="red" />
                <YAxis />
                <Tooltip />
                <Legend wrapperStyle={{ bottom: 'auto' }} />
              </LineChart>
            </div>
          </div>
        </div>
      </header>

      <header className='blog-header py-4'>
        <div className='row flex-nowrap justify-content-between align-items-center'>
          <div className='col-12'>
            <h4>AVG Positions Z-score</h4>
            <div className="container" style={{ width: '100%', height: '400px' }}>
              <LineChart width={1080} height={400} data={[...avgPositionsData]} margin={{ top: 5, right: 10, bottom: 5, left: 0 }} >
                <Line name="Longs" activeDot={{ r: 8 }} type="monotone" dataKey="long_avg_z_index" stroke="#008080" />
                <Line name="Shorts" activeDot={{ r: 8 }} type="monotone" dataKey="short_avg_z_index" stroke="#800000" />
                <CartesianGrid strokeDasharray="3 3" />
                <ReferenceLine y={50} stroke="red" />
                <XAxis textAnchor="end" dataKey="primary" height={50} angle={-85} />
                <YAxis />
                <Tooltip />
                <Legend wrapperStyle={{ bottom: 'auto' }} />
              </LineChart>
            </div>
          </div>
        </div>
      </header>

      <header className='blog-header py-4'>
        <div className='row flex-nowrap justify-content-between align-items-center'>
          <div className='col-6'>
            <h4>X - Traders/Y -  OI/Size - Avg position</h4>
            <div className="container" style={{ width: '100%', height: '400px' }}>
              <ComposedChart width={540} height={350} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
                             stackOffset="sign">
                <XAxis type="number" dataKey="traders" textAnchor="end"
                       allowDuplicatedCategory={true}
                       name="traders"
                       tickSize={3} scale="auto"
                       domain={['dataMin - 1', 'dataMax + 1']}
                       height={50} angle={-55} />
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis type="number" dataKey="oi" name="oi" allowDataOverflow={true} allowDecimals={true} />
                <ZAxis type="number" dataKey="avg_position" name="avg" range={[0, 100]}/>
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <ReferenceLine x={0} stroke="#0000FF"/>
                <Scatter name="Longs" data={longScatterData} fill="#008080" shape="circle">
                  <LabelList dataKey="current" />
                </Scatter>
                <Scatter name="Shorts" data={shortScatterData} fill="#800000" shape="circle">
                  <LabelList dataKey="current" />
                </Scatter>
                {/* <Line data={longScatterData} dataKey="traders" stroke="#008080" dot={false} activeDot={false} /> */}
                {/* <Line data={shortScatterData} dataKey="traders" stroke="#800000" dot={false} activeDot={false} /> */}
              </ComposedChart>
            </div>
          </div>
          <div className='col-6'>
            <h4>AVG positions</h4>
            <div className="container" style={{ width: '100%', height: '400px' }}>
              <BarChart width={540} height={350} data={[...avgPositionsData].reverse().slice(0, max_weeks_in_charts).reverse()}
                        margin={{ top: 5, right: 10, bottom: 0, left: 0 }} >
                <Bar name="Longs" dataKey="longs" fill="#008080" />
                <Bar name="Shorts" dataKey="shorts" fill="#800000" />
                <XAxis textAnchor="end" dataKey="primary" height={50} angle={-55} />
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis />
                <Tooltip />
                <Legend wrapperStyle={{ bottom: 'auto' }} />
              </BarChart>
            </div>
          </div>
        </div>
      </header>

      <header className='blog-header py-4'>
        <div className='row flex-nowrap justify-content-between align-items-center'>
          <div className='col-6'>
            <h4>Change in OI STD.D Z-Score</h4>
            <div className="container" style={{ width: '100%', height: '400px' }}>
              <LineChart width={540} height={400} data={changeInOpenInterest} margin={{ top: 5, right: 10, bottom: 0, left: 0 }} >
                <Line activeDot={{ r: 8 }} type="monotone" name="Longs (stand. deviation)" dataKey="change_longs_std" stroke="#008080" />
                <Line activeDot={{ r: 8 }} type="monotone" name="Shorts (stand. deviation)" dataKey="change_shorts_std" stroke="#800000" />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis textAnchor="end" dataKey="primary" height={50} angle={-55} />
                <YAxis />
                <Tooltip />
                <Legend wrapperStyle={{ bottom: 'auto' }} />
              </LineChart>
            </div>
          </div>
          <div className='col-6'>
            <h4>Change in OI Z-Score</h4>
            <div className="container" style={{ width: '100%', height: '400px' }}>
              <LineChart width={540} height={400} data={changeInOpenInterest} margin={{ top: 5, right: 10, bottom: 0, left: 0 }} >
                <Line activeDot={{ r: 8 }} type="monotone"name="Longs (1-year index)" dataKey="change_longs_z_index" stroke="#008080" />
                <Line activeDot={{ r: 8 }} type="monotone" name="Shorts (1-year index)" dataKey="change_shorts_z_index" stroke="#800000" />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis textAnchor="end" dataKey="primary" height={50} angle={-55} />
                <YAxis />
                <Tooltip />
                <Legend wrapperStyle={{ bottom: 'auto' }} />
              </LineChart>
            </div>
          </div>
        </div>
      </header>

      <header className='blog-header py-4'>
        <div className='row flex-nowrap justify-content-between align-items-center'>
          <div className='col-6'>
            <h3>Non-commercials (large speculators)</h3>
            <h4>Large Specs  (LT = 4) Gross Positions Z-Score</h4>
            <div className="container" style={{ width: '100%', height: '400px' }}>
              <LineChart width={540} height={400} data={largeSpecsGrossPositions} margin={{ top: 5, right: 10, bottom: 0, left: 0 }} >
                <Line activeDot={{ r: 8 }} type="monotone" name="Whales Gross longs (1-year index)" dataKey="change_longs_z_index" stroke="#008080" />
                <Line activeDot={{ r: 8 }} type="monotone" name="Whales Gross shorts (1-year index)" dataKey="change_shorts_z_index" stroke="#800000" />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis textAnchor="end" dataKey="primary" height={50} angle={-55} />
                <YAxis />
                <Tooltip />
                <Legend wrapperStyle={{ bottom: 'auto' }} />
              </LineChart>
            </div>
          </div>
          <div className='col-6'>
            <h4>Large Specs (LT = 4) Net Positions Z-Score</h4>
            <div className="container" style={{ width: '100%', height: '400px' }}>
              <LineChart width={540} height={400} data={largeSpecsNetPositions} margin={{ top: 5, right: 10, bottom: 0, left: 0 }} >
                <Line activeDot={{ r: 8 }} type="monotone" name="Whales Net longs (1-year index)" dataKey="change_longs_z_index" stroke="#008080" />
                <Line activeDot={{ r: 8 }} type="monotone" name="Whales Net shorts (1-year index)" dataKey="change_shorts_z_index" stroke="#800000" />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis textAnchor="end" dataKey="primary" height={50} angle={-55} />
                <YAxis />
                <Tooltip />
                <Legend wrapperStyle={{ bottom: 'auto' }} />
              </LineChart>
            </div>
          </div>
        </div>
      </header>

    </>
  )
}

export const DataTableCtx = createContext(DataTable)
