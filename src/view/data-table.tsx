import React, { createContext, FC } from 'react'
import { useGetAverage } from '../util/get-average'
import { useResolve } from '../util/use-resolve'

type TableValues = Array<(string | number)>

export interface DataTableProps {
  averagePeriod: number
  values: TableValues[]
}

const DataTable: FC<DataTableProps> = (props) => {
  // todo columns to add
  // avg_position, conviction, sentiment, net_clustering (only noncomm), net_concentration (only noncomm)

  const getAverage = useResolve(useGetAverage)

  const stats = getAverage(props.averagePeriod, props.values)

  const longAverage = stats(1).average.toLocaleString()
  const shortAverage = stats(2).average.toLocaleString()
  const longPercentageAverage = stats(5).average.toLocaleString()
  const shortPercentageAverage = stats(6).average.toLocaleString()

  const changeLongsStats = stats(3)
  const changeShortsStats = stats(4)
  const averageStats = stats(7)
  const netAverage = averageStats.average.toLocaleString()
  const longSentimentStats = stats(8)
  const shortSentimentStats = stats(9)
  // const longAvgPosStats = stats(11)
  // const shortAvgPosStats = stats(12)

  const propsMapped = props.values
    .map((x, idx) => ({
      date: x[0],
      longs: {
        val: x[1],
        prev_val: props.values[idx + 1]?.[1],
        className: '',
      },
      shorts: {
        val: x[2],
        prev_val: props.values[idx + 1]?.[2],
        className: '',
      },
      change_longs: x[3],
      change_longs_std: Number(x[3]) < 0
        ? (-1 * (Number(x[3]) - changeLongsStats.std_dev.mean_negative) / changeLongsStats.std_dev.std_dev_negative).toFixed(2)
        : ((Number(x[3]) - changeLongsStats.std_dev.mean_positive) / changeLongsStats.std_dev.std_dev_positive).toFixed(2),
      change_shorts: x[4],
      change_shorts_std: Number(x[4]) < 0
        ? (-1 * (Number(x[4]) - changeShortsStats.std_dev.mean_negative) / changeShortsStats.std_dev.std_dev_negative).toFixed(2)
        : ((Number(x[4]) - changeShortsStats.std_dev.mean_positive) / changeShortsStats.std_dev.std_dev_positive).toFixed(2),
      perc_longs: x[5],
      perc_shorts: x[6],
      long_sentiment: Number(x[8]).toFixed(2),
      long_sentiment_z_index: ((Number(x[8]) - longSentimentStats.min) / (longSentimentStats.max - longSentimentStats.min) * 100).toFixed(2),
      short_sentiment: Number(x[9]).toFixed(2),
      short_sentiment_z_index: ((Number(x[9]) - shortSentimentStats.min) / (shortSentimentStats.max - shortSentimentStats.min) * 100).toFixed(2),
      avg_long_pos: x[11],
      avg_short_pos: x[12],
      net_pos: {
        val: x[7],
        prev_val: props.values[idx + 1]?.[7],
        className: '',
      },
      net_pos_z_index: ((Number(x[7]) - averageStats.min) / (averageStats.max - averageStats.min) * 100).toFixed(2),
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

  // const mappedTableData = props.values.map(row => ({
  //   xvs: row.
  // }));

  return (
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
        {props.values.length >= props.averagePeriod && (
          <tr className="bg-light">
            <td title={`${props.averagePeriod} Period Simple Average`}>
              Average({props.averagePeriod})
            </td>
            <td>{longAverage}</td>
            <td>{shortAverage}</td>
            <td colSpan={2}></td>
            <td>{longPercentageAverage} %</td>
            <td>{shortPercentageAverage} %</td>
            <td colSpan={2}></td>
            <td>{netAverage}</td>
          </tr>
        )}
        {propsMapped.map((row, rowIndex) => (
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
              <span>STD. {Number.isNaN(row.change_longs_std) ? 'Not Available' : `${row.change_longs_std}`}</span>
            </td>
            <td key="change_shorts">
              <span style={{ display: 'block' }}>{Number.isNaN(row.change_shorts) ? 'Not Available' : row.change_shorts.toLocaleString()}</span>
              <span style={{ fontSize: '80%' }}>STD. {Number.isNaN(row.change_shorts_std) ? 'Not Available' : `${row.change_shorts_std}`}</span>
            </td>
            <td key="perc_longs">
              {Number.isNaN(row.perc_longs) ? 'Not Available' : `${row.perc_longs} %`}
            </td>
            <td key="perc_shorts">
              {Number.isNaN(row.perc_shorts) ? 'Not Available' : `${row.perc_shorts} %`}
            </td>
            <td key="sentiment_longs">
              <span style={{ display: 'block' }}>{Number.isNaN(row.long_sentiment) ? 'Not Available' : `${row.long_sentiment} %`}</span>
              <span style={{ fontSize: '80%' }}>Z-score {Number.isNaN(row.long_sentiment_z_index) ? 'Not Available' : `${row.long_sentiment_z_index} %`}</span>
            </td>
            <td key="sentiment_shorts">
              <span style={{ display: 'block' }}>{Number.isNaN(row.short_sentiment) ? 'Not Available' : `${row.short_sentiment} %`}</span>
              <span style={{ fontSize: '80%' }}>Z-score {Number.isNaN(row.short_sentiment_z_index) ? 'Not Available' : `${row.short_sentiment_z_index} %`}</span>
            </td>
            <td className={row.net_pos.className} key="net_pos">
              <span style={{ display: 'block' }}>{Number.isNaN(row.net_pos.val) ? 'Not Available' : row.net_pos.val.toLocaleString()}</span>
              <span style={{ fontSize: '80%' }}>Z-score {Number.isNaN(row.net_pos_z_index) ? 'Not Available' : `${row.net_pos_z_index} %`}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export const DataTableCtx = createContext(DataTable)
