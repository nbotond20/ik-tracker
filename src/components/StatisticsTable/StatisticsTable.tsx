import type { CalculateStatisticsReturnType } from '@utils/calculateStatistics'
import { safeNumber } from '@utils/nullToZero'

export const StatisticsTable = ({ statistics }: { statistics: CalculateStatisticsReturnType }) => {
  return (
    <div className="flex flex-col justify-center">
      <table className="mb-4 w-full">
        <thead>
          <tr className="rounded-lg text-gray-600 dark:text-gray-200 text-sm leading-normal">
            <th className="py-1 pr-2 text-left text-base">Σ Credit</th>
            <th className="py-1 px-2 text-left"></th>
          </tr>
        </thead>
        <tbody className="flex-1 sm:flex-none">
          <tr className="rounded-lg text-gray-600 dark:text-gray-400 text-sm leading-normal">
            <td className="py-1 pr-2 text-left">
              <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px] italic">Total Credit</span>
            </td>
            <td className="py-1 px-2 text-right font-semibold">{safeNumber(statistics?.totalCredit)}</td>
          </tr>
          <tr className="rounded-lg text-gray-600 dark:text-gray-400 text-sm leading-normal">
            <td className="py-1 pr-2 text-left">
              <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px] italic">Passed Credit</span>
            </td>
            <td className="py-1 px-2 text-right font-semibold">{safeNumber(statistics?.passedCredit)}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr className="rounded-lg text-gray-600 dark:text-gray-200 text-sm leading-normal">
            <th className="py-1 pr-2 text-left text-base">Σ Average</th>
            <th className="py-1 px-2 text-left"></th>
          </tr>
        </thead>
        <tbody className="flex-1 sm:flex-none">
          <tr className="rounded-lg text-gray-600 dark:text-gray-400 text-sm leading-normal">
            <td className="py-1 pr-2 text-left">
              <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px] italic">Credit Index</span>
            </td>
            <td className="py-1 px-2 text-right font-semibold">{safeNumber(statistics?.creditIndex)}</td>
          </tr>
          <tr className="rounded-lg text-gray-600 dark:text-gray-400 text-sm leading-normal">
            <td className="py-1 pr-2 text-left">
              <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px] italic">
                Corrected Credit Index
              </span>
            </td>
            <td className="py-1 px-2 text-right font-semibold">{safeNumber(statistics?.correctedCreditIndex)}</td>
          </tr>
          <tr className="rounded-lg text-gray-600 dark:text-gray-400 text-sm leading-normal">
            <td className="py-1 pr-2 text-left">
              <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px] italic">
                Weighted Average
              </span>
            </td>
            <td className="py-1 px-2 text-right font-semibold">{safeNumber(statistics?.weightedAverage)}</td>
          </tr>
          <tr className="rounded-lg text-gray-600 dark:text-gray-400 text-sm leading-normal">
            <td className="py-1 pr-2 text-left">
              <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[50px] italic">Average</span>
            </td>
            <td className="py-1 px-2 text-right font-semibold">{safeNumber(statistics?.average)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
