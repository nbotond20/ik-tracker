interface SubjectInfoProps {
  label: string
  value: string | number | undefined
  className?: string
}

export const SubjectInfo = ({ label, value, className }: SubjectInfoProps) => {
  return (
    <div className={`flex flex-col space-y-2 ${className || ''}`}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
      <input
        type="text"
        className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200 dark:focus:ring-blue-800"
        value={value}
        disabled
      />
    </div>
  )
}
