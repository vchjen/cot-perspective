import { DataTableProps } from '../view/data-table'
import { Use } from './resolve-container'

interface StdDev {
  mean: number
  mean_negative: number
  mean_positive: number
  std_dev: number
  std_dev_negative: number
  std_dev_positive: number
}

interface AverageStats {
  average: number
  max: number
  min: number
  std_dev: StdDev
}

type GetAverage =
  (p: number, v: DataTableProps['values']) =>
  (rowIndex: number) => AverageStats

/**
 * Returns function that calculates average, and returns
 * formatted value in locale string, for the chosen row
 */
export const useGetAverage: Use<GetAverage> = () => {
  return (period, values) => (rowIndex) => {
    const slice = values
      .slice(0, period)
    const numbers = slice.map(row => Number(row[rowIndex]))
    const numbersNegative = numbers.filter(n => n < 0)
    const numbersPositive = numbers.filter(n => n > 0)

    const sum = numbers
      .reduce((total, row) => total + row, 0)
    const average = Math.trunc(sum / period)
    const max = numbers.reduce((acc, row) => Math.max(row, acc), 0)
    const mean = numbers.reduce((acc, row) => acc + row, 0) / numbers.length
    const min = numbers.reduce((acc, row) => Math.min(row, acc), Number.MAX_SAFE_INTEGER)
    const stdDev = Math.sqrt(
      numbers
        .reduce((acc: number[], val) => acc.concat((val - mean) ** 2), [])
        .reduce((acc, val) => acc + val, 0) /
      (numbers.length - 1)
    )

    const meanNegative = numbersNegative.reduce((acc, row) => acc + row, 0) / numbersNegative.length
    const meanPositive = numbersPositive.reduce((acc, row) => acc + row, 0) / numbersPositive.length

    const stdDevNegative = Math.sqrt(
      numbersNegative
        .reduce((acc: number[], val) => acc.concat((val - meanNegative) ** 2), [])
        .reduce((acc, val) => acc + val, 0) /
      (numbersNegative.length - 1)
    )
    const stdDevPositive = Math.sqrt(
      numbersNegative
        .reduce((acc: number[], val) => acc.concat((val - meanPositive) ** 2), [])
        .reduce((acc, val) => acc + val, 0) /
      (numbersNegative.length - 1)
    )

    return {
      average,
      max,
      min,
      std_dev: {
        mean,
        std_dev: stdDev,
        mean_negative: meanNegative,
        mean_positive: meanPositive,
        std_dev_negative: stdDevNegative,
        std_dev_positive: stdDevPositive,
      },
    }
  }
}
