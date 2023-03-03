import React from 'react'

import type { Exam } from '@prisma/client'

interface ExamsTableProps {
  exams: Exam[]
}

export const ExamsTable = ({ exams }: ExamsTableProps) => {
  return (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
        <tr>
          <th scope="col" className="px-3 py-1 bg-gray-50 dark:bg-gray-800"></th>
          <th scope="col" className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-center">
            Points
          </th>
          <th scope="col" className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-center">
            Max
          </th>
          <th scope="col" className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-center">
            Min
          </th>
        </tr>
      </thead>
      <tbody>
        {exams.map(exam => (
          <tr key={exam.id}>
            <th
              scope="row"
              className="px-3 py-2 font-medium text-gray-900 bg-gray-50 dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
            >
              {exam.name}
            </th>
            <td className="px-2 py-1 border border-gray-300 dark:border-gray-600 text-center">
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                className="max-w-[40px] text-center bg-gray-50 border border-gray-300 m-auto text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="-"
                value={exam.result ?? ''}
              />
            </td>
            <td className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-center">
              {exam.maxResult ?? '-'}
            </td>
            <td className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center">
              {exam.minResult ?? '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
