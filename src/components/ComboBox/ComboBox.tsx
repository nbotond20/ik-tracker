import { Fragment, useEffect, useState } from 'react'

import { Combobox as HeadlessCombobox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'

interface ComboboxProps {
  items: Item[]
  onItemSelected?: (item: Item | undefined) => unknown
  initialSelectedItem?: Item
  className?: string
  label?: string
  placeholder?: string
}

export interface Item {
  id: string
  name: string
  value: string
  data?: unknown
}

export const Combobox = ({
  items,
  onItemSelected,
  className,
  label,
  initialSelectedItem,
  placeholder,
}: ComboboxProps) => {
  const [filteredItems, setItemsState] = useState<Item[]>(items)
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(initialSelectedItem)

  const [query, setQuery] = useState('')

  useEffect(() => {
    if (query === '') {
      setItemsState(items)
    } else {
      setItemsState(prev =>
        prev.filter(
          item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.value.toLowerCase().includes(query.toLowerCase())
        )
      )
    }
  }, [query, items])

  useEffect(() => {
    setQuery('')
    if (onItemSelected) {
      onItemSelected(selectedItem)
    }
  }, [selectedItem, onItemSelected])

  return (
    <div className={className || ''}>
      <HeadlessCombobox value={selectedItem || {}} onChange={setSelectedItem}>
        <div className="relative flex w-full h-full flex-col">
          <div className="flex flex-col space-y-1">
            {label && <label className={`text-sm font-medium text-gray-700 dark:text-gray-200`}>{label}</label>}
            <div className="relative flex w-full">
              <HeadlessCombobox.Input
                onChange={event => setQuery(event.target.value)}
                className="placeholder:text-gray-400 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800 pr-9"
                displayValue={(item: Item) => item.name}
                placeholder={placeholder}
              />
              <HeadlessCombobox.Button className="h-6 w-6 absolute right-2 top-2.5">
                <ChevronUpDownIcon className="h-6 w-6 text-gray-400" />
              </HeadlessCombobox.Button>
            </div>
          </div>

          <HeadlessCombobox.Options className="min-h-[30px] max-h-32 mt-1 overflow-y-auto top-12 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800 flex flex-col gap-2">
            {filteredItems.map((item, idx) => (
              <HeadlessCombobox.Option key={item.id} value={item} as={Fragment}>
                {({ active, selected }) => (
                  <li
                    className={`pr-2 py-1 pl-7 flex w-full items-center relative ${
                      active ? 'bg-gray-200 dark:bg-gray-500' : ''
                    } ${idx === 0 ? 'pt-2' : ''} ${idx === filteredItems.length - 1 ? 'pb-2' : ''}`}
                  >
                    {selected && <CheckIcon className="w-5 h-5 stroke-2 absolute left-1" />}
                    {item.name}
                  </li>
                )}
              </HeadlessCombobox.Option>
            ))}
            {filteredItems.length === 0 && (
              <HeadlessCombobox.Option value={undefined} as={Fragment}>
                <li className={`px-2 py-1 flex w-full items-center relative text-gray-400`}>No results found</li>
              </HeadlessCombobox.Option>
            )}
          </HeadlessCombobox.Options>
        </div>
      </HeadlessCombobox>
    </div>
  )
}
