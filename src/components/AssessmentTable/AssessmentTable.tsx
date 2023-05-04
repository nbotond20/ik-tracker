import type { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import type { Assessment } from '@prisma/client'

interface AssessmentsTableProps {
  assessmentResults: Assessment[]
  setAssessmentResults: Dispatch<SetStateAction<Assessment[]>>
  assessmentsErrorMessages: Record<string, string>
}

export const AssessmentsTable = ({
  assessmentResults,
  setAssessmentResults,
  assessmentsErrorMessages,
}: AssessmentsTableProps) => {
  const { t } = useTranslation()

  return assessmentResults.length > 0 ? (
    <>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
          <tr>
            <th scope="col" className="px-3 py-1 bg-gray-50 dark:bg-gray-800"></th>
            <th scope="col" className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-center">
              {t('components.assessmentTable.score')}
            </th>
            <th scope="col" className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-center">
              {t('components.assessmentTable.max')}
            </th>
            <th scope="col" className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-center">
              {t('components.assessmentTable.min')}
            </th>
          </tr>
        </thead>
        <tbody>
          {assessmentResults.map(assessment => (
            <tr key={assessment.id}>
              <th
                scope="row"
                className="px-3 py-2 font-medium text-gray-900 bg-gray-50 dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
              >
                {assessment.name}
              </th>
              <td className="px-2 py-1 border border-gray-300 dark:border-gray-600 text-center">
                {assessment.resultType !== 'PASSFAIL' ? (
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="max-w-[60px] text-center bg-gray-50 border border-gray-300 m-auto text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="-"
                    value={assessment.result ?? ''}
                    onChange={e =>
                      setAssessmentResults(prev =>
                        e.target.validity.valid
                          ? prev.map(assessmentResult => {
                              if (assessmentResult.id === assessment.id) {
                                return {
                                  ...assessmentResult,
                                  result: e.target.value === '' ? null : Number(e.target.value),
                                }
                              }
                              return assessmentResult
                            })
                          : prev
                      )
                    }
                  />
                ) : (
                  <input
                    value={1}
                    type="checkbox"
                    defaultChecked={!!assessment.result}
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                    onChange={e =>
                      setAssessmentResults(prev =>
                        prev.map(assessmentResult => {
                          if (assessmentResult.id === assessment.id) {
                            return { ...assessmentResult, result: e.target.checked ? 1 : null }
                          }
                          return assessmentResult
                        })
                      )
                    }
                  />
                )}
              </td>
              <td className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-center">
                {assessment.maxResult ?? '-'}
              </td>
              <td className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center">
                {assessment.minResult ?? '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <ul>
          {Object.keys(assessmentsErrorMessages).map(e => (
            <li className="text-red-500 text-sm font-medium" key={e}>
              {assessmentsErrorMessages[e]}
            </li>
          ))}
        </ul>
      </div>
    </>
  ) : (
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-base w-full text-center">
        {t('components.assessmentTable.noAssessments')}
      </p>
    </div>
  )
}
