import { TraderCategory } from '../model/trader-categories'
import { CSVData, FormattedCSVData } from '../model/types'
import { Use } from './resolve-container'

type ProcessTableData =
  (c: TraderCategory) =>
  (v: FormattedCSVData) => Array<string|number>

/**
 * For a given trader category, return a function that prepares
 * an array of data to be used in table/view rendering
 */
export const useProcessTableData: Use<ProcessTableData> = () => {
  return (selectedTraderCategory) => (values) => {
    if (selectedTraderCategory === 'Commercial' && values.market === 'GOLD') {
      console.log('GOLD / COMMERCIAL')
    }

    // const isCommercial = selectedTraderCategory === 'Commercial'
    const longs = Number(values[`${selectedTraderCategory} Positions-Long (All)` as keyof CSVData])
    const shorts = Number(values[`${selectedTraderCategory} Positions-Short (All)` as keyof CSVData])
    const spreads = Number(values[`${selectedTraderCategory} Positions-Spreading (All)` as keyof CSVData])
    const totalOpenInterest = Number(values['Open Interest (All)' as keyof CSVData])
    const netPositions = longs - shorts
    const spreadingTraders = selectedTraderCategory === 'Commercial'
      ? 0
      : Number(values[`Traders-${selectedTraderCategory}-Spreading (All)` as keyof CSVData])
    const longTraders = Number(values[`Traders-${selectedTraderCategory}-Long (All)` as keyof CSVData])
    const shortTraders = Number(values[`Traders-${selectedTraderCategory}-Short (All)` as keyof CSVData])
    const allTraders = Number(values['Traders-Total (All)'] as keyof CSVData)
    const longSentiment = longTraders / allTraders * 100
    const shortSentiment = shortTraders / allTraders * 100
    const spreadSentiment = spreadingTraders / allTraders * 100
    const avgLongPosition = longs / longTraders
    const avgShortPosition = shorts / shortTraders
    const netSentiment = longTraders - shortTraders

    const longConviction = Number(Number(longs / totalOpenInterest).toFixed(2))
    const shortConviction = Number(Number(shorts / totalOpenInterest).toFixed(2))
    const spreadConviction = Number(Number(spreads / totalOpenInterest).toFixed(2))
    const netConviction = Number(((longs - shorts) / totalOpenInterest).toFixed(2))

    return [
      /* 0 */ values['As of Date in Form YYYY-MM-DD'],
      /* 1 */ longs,
      /* 2 */ shorts,
      /* 3 */ Number(values[`Change in ${selectedTraderCategory}-Long (All)` as keyof CSVData]),
      /* 4 */ Number(values[`Change in ${selectedTraderCategory}-Short (All)` as keyof CSVData]),
      /* 5 */ values[`% of OI-${selectedTraderCategory}-Long (All)` as keyof CSVData],
      /* 6 */ values[`% of OI-${selectedTraderCategory}-Short (All)` as keyof CSVData],
      /* 7 */ netPositions,
      /* 8 */ longSentiment,
      /* 9 */ shortSentiment,
      /* 10 */ spreadSentiment,
      /* 11 */ avgLongPosition,
      /* 12 */ avgShortPosition,
      /* 13 */ values['Concentration-Net LT =4 TDR-Long (All)' as keyof CSVData],
      /* 14 */ values['Concentration-Net LT =4 TDR-Short (All)' as keyof CSVData],
      /* 15 */ values['Concentration-Gross LT = 4 TDR-Long (All)' as keyof CSVData],
      /* 16 */ values['Concentration-Gross LT =4 TDR-Short (All)' as keyof CSVData],
      /* 17 */ longTraders,
      /* 18 */ shortTraders,
      /* 19 */ spreadingTraders,
      /* 20 */ netSentiment,
      /* 21 */ longConviction,
      /* 22 */ shortConviction,
      /* 23 */ spreadConviction,
      /* 24 */ netConviction,
    ]
  }
}
