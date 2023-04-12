import { useState } from 'react'

import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

interface PlannerInputGroupProps {
  show: boolean | undefined
}

export const PlannerInputGroup = ({ show }: PlannerInputGroupProps) => {
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
        <span className="text-gray-500 text-sm">Show details</span>
        {!showInput ? (
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
              width: '17px',
              position: 'absolute',
              borderBottomLeftRadius: '10px',
              top: '-8px',
              left: -17,
              zIndex: -1,
            }}
            className="dark:border-gray-600 border-gray-200 border-l-2 border-b-2"
          />
          <input
            tabIndex={-1}
            placeholder="Credit"
            className="h-[30px] mb-2 w-full placeholder:text-gray-400 rounded-lg border bg-white px-2 py-1 text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-600 dark:focus:ring-blue-500"
          />
          <div
            style={{
              height: '48px',
              width: '17px',
              borderBottomLeftRadius: '10px',
              position: 'absolute',
              top: 23,
              left: -17,
              zIndex: -1,
            }}
            className="dark:border-gray-600 border-gray-200 border-l-2 border-b-2"
          />
          <select
            tabIndex={-1}
            placeholder="Subject Type"
            className="h-[30px] mb-2 w-full placeholder:text-gray-400 rounded-lg border bg-white px-2 py-1 text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-600 dark:focus:ring-blue-500"
            defaultValue={'select'}
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
              width: '17px',
              borderBottomLeftRadius: '10px',
              position: 'absolute',
              top: 61,
              left: -17,
              zIndex: -1,
            }}
            className="dark:border-gray-600 border-gray-200 border-l-2 border-b-2"
          />
          <select
            tabIndex={-1}
            placeholder="Subject Type"
            className="h-[30px] mb-2 w-full placeholder:text-gray-400 rounded-lg border bg-white px-2 py-1 text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-600 dark:focus:ring-blue-500"
            defaultValue={'select'}
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
              width: '17px',
              borderBottomLeftRadius: '10px',
              position: 'absolute',
              top: 99,
              left: -17,
              zIndex: -1,
            }}
            className="dark:border-gray-600 border-gray-200 border-l-2 border-b-2"
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
            />
            <input
              tabIndex={-1}
              placeholder="Practice"
              className="col-span-6 h-[30px] mb-2 w-full placeholder:text-gray-400 rounded-lg border bg-white px-2 py-1 text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-600 dark:focus:ring-blue-500"
            />
          </div>
          <div
            style={{
              height: '48px',
              width: '17px',
              borderBottomLeftRadius: '10px',
              position: 'absolute',
              top: 137,
              left: -17,
              zIndex: -1,
            }}
            className="dark:border-gray-600 border-gray-200 border-l-2 border-b-2"
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
            />
            <input
              tabIndex={-1}
              placeholder="Consultation"
              className="col-span-6 h-[30px] mb-2 w-full placeholder:text-gray-400 rounded-lg border bg-white px-2 py-1 text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 dark:bg-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-600 dark:focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  ) : null
}