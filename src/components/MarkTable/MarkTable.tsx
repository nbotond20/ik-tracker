import type { Dispatch, SetStateAction } from 'react'
import React from 'react'

import { InputField } from '@components/InputField/InputField'
import { ResultType } from '@prisma/client'
import { getResultTypeDisplay } from '@utils/getResultTypeDisplay'

export type Marks = [number, number, number, number, number]

interface MarkTableProps {
  maxResult: number
  resultType: ResultType
  marks: Marks
  editing?: boolean
  setMarks?: Dispatch<SetStateAction<Marks>>
}

export const MarkTable = ({ marks, maxResult, resultType, editing, setMarks }: MarkTableProps) => {
  return (
    <table className="w-full text-sm text-gray-500 dark:text-gray-400 ">
      <thead>
        <tr>
          <th scope="col" className="px-2 py-1 border border-gray-300 dark:border-gray-600 text-center">
            Mark
          </th>
          <th scope="col" className="px-2 py-1 border border-gray-300 dark:border-gray-600 text-center">
            Grade
          </th>
        </tr>
      </thead>
      <tbody>
        {!editing &&
          marks &&
          marks.map((mark, index) => (
            <tr key={index}>
              <td className="px-2 py-1 border border-gray-300 dark:border-gray-600 text-center">
                {mark !== -1 ? `${mark}${getResultTypeDisplay(resultType)}` : '-'}
              </td>
              <td className="px-2 py-1 border border-gray-300 dark:border-gray-600 text-center">{index + 1}</td>
              <td className="px-2 py-1 border border-gray-300 dark:border-gray-600 text-center">
                {mark !== -1
                  ? resultType === ResultType.POINT && index !== 0
                    ? `${Math.round((mark / maxResult) * 100)}`
                    : '-'
                  : '-'}
              </td>
            </tr>
          ))}
        {editing &&
          Array.from(Array(5).keys()).map((_, index) => (
            <tr key={index}>
              <td className="py-1 border border-gray-300 dark:border-gray-600 text-center">
                <InputField
                  pattern="[0-9]*"
                  inputMode="numeric"
                  type="number"
                  value={index !== 0 ? (marks[index] !== -1 ? marks[index] : '') : 0}
                  disabled={index === 0}
                  placeholder="-"
                  className="w-1/4 m-auto"
                  inputClassName="text-center px-1 py-[2px]"
                  onChange={e => {
                    setMarks?.(
                      prev =>
                        prev.map((mark, i) =>
                          i === index ? (e.target.validity.valid ? Number(e.target.value) : -1) : mark
                        ) as Marks
                    )
                  }}
                />
              </td>
              <td className="px-10 py-1 border border-gray-300 dark:border-gray-600 text-center">{index + 1}</td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}
