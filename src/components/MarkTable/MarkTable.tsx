import type { Dispatch, SetStateAction } from 'react'
import React from 'react'

import { InputField } from '@components/InputField/InputField'

export type Marks = [number, number, number, number, number]

interface MarkTableProps {
  maxResult: number
  marks: Marks
  editing?: boolean
  setMarks?: Dispatch<SetStateAction<Marks>>
}

export const MarkTable = ({ marks, maxResult, editing, setMarks }: MarkTableProps) => {
  return (
    <table className="w-full text-sm text-gray-500 dark:text-gray-400 ">
      <thead>
        <tr>
          <th scope="col" className="px-1 py-1 border border-gray-300 dark:border-gray-600 text-center">
            Points
          </th>
          <th scope="col" className="px-1 py-1 border border-gray-300 dark:border-gray-600 text-center">
            Grade
          </th>
        </tr>
      </thead>
      <tbody>
        {!editing &&
          marks &&
          marks.map((mark, index) => (
            <tr key={index}>
              <td className="px-1 py-1 border border-gray-300 dark:border-gray-600 text-center">
                {mark !== -1 ? `${mark}p` : '-'}
              </td>
              <td className="px-1 py-1 border border-gray-300 dark:border-gray-600 text-center">{index + 1}</td>
              <td className="px-1 py-1 border border-gray-300 dark:border-gray-600 text-center">
                {mark !== -1 && maxResult !== 0
                  ? index !== 0
                    ? `${Math.round((mark / maxResult) * 100)}%`
                    : '-'
                  : '-'}
              </td>
            </tr>
          ))}
        {editing &&
          Array.from(Array(5).keys()).map((_, index) => (
            <tr key={index}>
              <td className="py-1 border border-gray-300 dark:border-gray-600 text-center">
                {/* TODO: Fix number input (can't remove 0) */}
                <InputField
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={index !== 0 ? (marks[index] !== -1 ? marks[index] : '') : 0}
                  disabled={index === 0}
                  placeholder="-"
                  className="w-1/4 m-auto"
                  inputClassName="text-center px-1 py-[2px]"
                  onChange={e => {
                    setMarks?.(prev =>
                      e.target.validity.valid
                        ? (prev.map((mark, i) =>
                            i === index ? (e.target.value === '' ? -1 : Number(e.target.value)) : mark
                          ) as Marks)
                        : prev
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
