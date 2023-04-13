import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import type { ISubject } from '@pages/dashboard/planner'

interface PlannerInputGroupProps {
  show: boolean | undefined
  subject: ISubject
  setSubjects: Dispatch<SetStateAction<ISubject[]>>
}

export const PlannerInputGroup = ({ show, subject, setSubjects }: PlannerInputGroupProps) => {
  const [showInput, setShowInput] = useState(true)
  return show ? (
    <div className="col-span-10 isolate relative">
      <div className="mt-4" />
      <div
        className="absolute flex justify-center items-center gap-2 cursor-pointer"
        style={{
          top: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        onClick={() => setShowInput(prev => !prev)}
      >
        <span className="text-gray-500 text-sm">{showInput ? 'Hide' : 'Show'} details</span>
        {showInput ? (
          <ChevronUpIcon className="h-6 w-6 text-gray-500  z-50" />
        ) : (
          <ChevronDownIcon className="h-6 w-6 text-gray-500 z-50" />
        )}
      </div>
      {showInput && (
        <div className="w-full">
          <div
            style={{
              height: '40px', // 25 + 2 = 27
              position: 'absolute',
              borderBottomLeftRadius: '10px',
              top: '-8px',
              zIndex: -1,
            }}
            className="dark:border-gray-600 border-gray-200 border-l-2 border-b-2 w-[17px] -left-[17px] sm:w-[38px] sm:-left-[38px]"
          />
          <input
            tabIndex={-1}
            placeholder="Credit"
            className="h-[30px] mb-2 w-full placeholder:text-gray-400 rounded-lg border bg-white px-2 py-1 text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-600 dark:focus:ring-blue-500"
            value={subject.credit || ''}
            inputMode="numeric"
            pattern="[0-9]*"
            onChange={e =>
              setSubjects(prev =>
                prev.map(sub => {
                  if (sub.id === subject.id) {
                    return { ...sub, credit: e.target.value === '' ? undefined : Number(e.target.value) }
                  }
                  return sub
                })
              )
            }
          />
          <div
            style={{
              height: '48px',
              borderBottomLeftRadius: '10px',
              position: 'absolute',
              top: 23,
              zIndex: -1,
            }}
            className="dark:border-gray-600 border-gray-200 border-l-2 border-b-2 w-[17px] -left-[17px] sm:w-[38px] sm:-left-[38px]"
          />
          <select
            tabIndex={-1}
            placeholder="Subject Type"
            className="h-[30px] mb-2 w-full placeholder:text-gray-400 rounded-lg border bg-white px-2 py-1 text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-600 dark:focus:ring-blue-500"
            value={subject.subjectType || 'select'}
            onChange={e =>
              setSubjects(prev =>
                prev.map(sub => {
                  if (sub.id === subject.id) {
                    return { ...sub, subjectType: e.target.value as 'TOR' | 'KOT' | 'KV' | 'SZAB' }
                  }
                  return sub
                })
              )
            }
          >
            <option value="select" disabled>
              Select a subject type...
            </option>
            <option value="TOR">Törzsanyag</option>
            <option value="KOT">Kötelező</option>
            <option value="KV">Kötelezően választható</option>
            <option value="SZAB">Szabadon választható</option>
          </select>
          <div
            style={{
              height: '48px',
              borderBottomLeftRadius: '10px',
              position: 'absolute',
              top: 61,
              zIndex: -1,
            }}
            className="dark:border-gray-600 border-gray-200 border-l-2 border-b-2 w-[17px] -left-[17px] sm:w-[38px] sm:-left-[38px]"
          />
          <select
            tabIndex={-1}
            placeholder="Subject Type"
            className="h-[30px] mb-2 w-full placeholder:text-gray-400 rounded-lg border bg-white px-2 py-1 text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-600 dark:focus:ring-blue-500"
            value={subject.creditType || 'select'}
            onChange={e =>
              setSubjects(prev =>
                prev.map(sub => {
                  if (sub.id === subject.id) {
                    return { ...sub, creditType: e.target.value as 'INF' | 'SZAM' | 'MAT' | 'EGYEB' }
                  }
                  return sub
                })
              )
            }
          >
            <option value="select" disabled>
              Select a credit type...
            </option>
            <option value="INF">Inf</option>
            <option value="SZAM">Szám</option>
            <option value="MAT">Mat</option>
            <option value="EGYEB">Egyéb</option>
          </select>
          <div
            style={{
              height: '48px',
              borderBottomLeftRadius: '10px',
              position: 'absolute',
              top: 99,
              zIndex: -1,
            }}
            className="dark:border-gray-600 border-gray-200 border-l-2 border-b-2 w-[17px] -left-[17px] sm:w-[38px] sm:-left-[38px]"
          />
          <div className="grid grid-cols-12 gap-2 relative">
            <div
              style={{
                height: '2px',
                width: '10px',
                zIndex: -1,
                left: '50%',
                transform: 'translateX(-50%)',
                top: '14px',
              }}
              className="dark:bg-gray-600 bg-gray-200 absolute"
            />
            <input
              tabIndex={-1}
              placeholder="Lecture"
              className="col-span-6 h-[30px] mb-2 w-full placeholder:text-gray-400 rounded-lg border bg-white px-2 py-1 text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-600 dark:focus:ring-blue-500"
              value={subject.lecture || ''}
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={e =>
                setSubjects(prev =>
                  prev.map(sub => {
                    if (sub.id === subject.id) {
                      return { ...sub, lecture: e.target.value === '' ? undefined : Number(e.target.value) }
                    }
                    return sub
                  })
                )
              }
            />
            <input
              tabIndex={-1}
              placeholder="Practice"
              className="col-span-6 h-[30px] mb-2 w-full placeholder:text-gray-400 rounded-lg border bg-white px-2 py-1 text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-600 dark:focus:ring-blue-500"
              value={subject.practice || ''}
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={e =>
                setSubjects(prev =>
                  prev.map(sub => {
                    if (sub.id === subject.id) {
                      return { ...sub, practice: e.target.value === '' ? undefined : Number(e.target.value) }
                    }
                    return sub
                  })
                )
              }
            />
          </div>
          <div
            style={{
              height: '48px',
              borderBottomLeftRadius: '10px',
              position: 'absolute',
              top: 137,
              zIndex: -1,
            }}
            className="dark:border-gray-600 border-gray-200 border-l-2 border-b-2 w-[17px] -left-[17px] sm:w-[38px] sm:-left-[38px]"
          />
          <div className="grid grid-cols-12 gap-2 relative">
            <div
              style={{
                height: '2px',
                width: '10px',
                zIndex: -1,
                left: '50%',
                transform: 'translateX(-50%)',
                top: '14px',
              }}
              className="dark:bg-gray-600 bg-gray-200 absolute"
            />
            <input
              tabIndex={-1}
              placeholder="Labor"
              className="col-span-6 h-[30px] mb-2 w-full placeholder:text-gray-400 rounded-lg border bg-white px-2 py-1 text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-600 dark:focus:ring-blue-500"
              value={subject.labor || ''}
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={e =>
                setSubjects(prev =>
                  prev.map(sub => {
                    if (sub.id === subject.id) {
                      return { ...sub, labor: e.target.value === '' ? undefined : Number(e.target.value) }
                    }
                    return sub
                  })
                )
              }
            />
            <input
              tabIndex={-1}
              placeholder="Consultation"
              className="col-span-6 h-[30px] mb-2 w-full placeholder:text-gray-400 rounded-lg border bg-white px-2 py-1 text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-600 dark:focus:ring-blue-500"
              value={subject.consultation || ''}
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={e =>
                setSubjects(prev =>
                  prev.map(sub => {
                    if (sub.id === subject.id) {
                      return { ...sub, consultation: e.target.value === '' ? undefined : Number(e.target.value) }
                    }
                    return sub
                  })
                )
              }
            />
          </div>
        </div>
      )}
    </div>
  ) : null
}
