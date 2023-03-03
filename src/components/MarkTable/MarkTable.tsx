import React from 'react'

import { ResultType } from '@prisma/client'
import { getResultTypeDisplay } from '@utils/getResultTypeDisplay'

interface MarkTableProps {
  maxResult: number
  resultType: ResultType
  marks: [number, number, number, number, number]
}

export const MarkTable = ({ marks, maxResult, resultType }: MarkTableProps) => {
  return (
    <table className="w-full text-sm text-gray-500 dark:text-gray-400 ">
      <tbody>
        {marks.map((mark, index) => (
          <tr key={index}>
            <td className="px-2 py-1 border border-gray-300 dark:border-gray-600 text-right">{`${mark}${getResultTypeDisplay(
              resultType
            )}`}</td>
            <td className="px-2 py-1 border border-gray-300 dark:border-gray-600 text-center">{index + 1}</td>
            <td className="px-2 py-1 border border-gray-300 dark:border-gray-600 text-right">
              {resultType === ResultType.POINT && index !== 0 ? `${Math.round((mark / maxResult) * 100)}` : '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
