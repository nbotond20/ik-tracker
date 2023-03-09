import type { Dispatch, SetStateAction } from 'react'

import type { Exam } from '@prisma/client'

interface ExamsTableProps {
  examResults: Exam[]
  setExamResults: Dispatch<SetStateAction<Exam[]>>
}

export const ExamsTable = ({ examResults, setExamResults }: ExamsTableProps) => {
  return examResults.length > 0 ? (
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
        {examResults.map(exam => (
          <tr key={exam.id}>
            <th
              scope="row"
              className="px-3 py-2 font-medium text-gray-900 bg-gray-50 dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
            >
              {exam.name}
            </th>
            <td className="px-2 py-1 border border-gray-300 dark:border-gray-600 text-center">
              {exam.resultType !== 'PASSFAIL' ? (
                <input
                  type="number"
                  className="max-w-[40px] text-center bg-gray-50 border border-gray-300 m-auto text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="-"
                  value={exam.result ?? ''}
                  onChange={e =>
                    setExamResults(prev =>
                      prev.map(examResult => {
                        if (examResult.id === exam.id) {
                          return { ...examResult, result: e.target.value === '' ? null : Number(e.target.value) }
                        }
                        return examResult
                      })
                    )
                  }
                />
              ) : (
                <input
                  value={1}
                  type="checkbox"
                  defaultChecked={!!exam.result}
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                  onChange={e =>
                    setExamResults(prev =>
                      prev.map(examResult => {
                        if (examResult.id === exam.id) {
                          return { ...examResult, result: e.target.checked ? 1 : null }
                        }
                        return examResult
                      })
                    )
                  }
                />
              )}
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
  ) : (
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-base w-full text-center">No exams added yet</p>
    </div>
  )
}
