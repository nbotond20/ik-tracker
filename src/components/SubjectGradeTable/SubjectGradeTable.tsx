import { useTranslation } from 'react-i18next'

import { Badge } from '@components/Badge/Badge'
import type { Statistics } from '@pages/dashboard'

interface SubjectGradeTableProps {
  statistics?: Statistics
}

export const SubjectGradeTable = ({ statistics }: SubjectGradeTableProps) => {
  const { t } = useTranslation()

  return statistics?.subjectProgressesWithGrade && statistics?.subjectProgressesWithGrade.length > 0 ? (
    <div className="w-full lg:w-auto">
      <table className="w-full lg:w-auto">
        <thead>
          <tr className="rounded-lg text-gray-600 dark:text-gray-200 text-sm leading-normal">
            <th className="py-1 pr-2 text-left text-base">{t('components.subjectGradeTable.subject')}</th>
            <th className="py-1 px-2 text-right text-base">{t('components.subjectGradeTable.grade')}</th>
          </tr>
        </thead>
        <tbody className="flex-1 sm:flex-none">
          {statistics?.subjectProgressesWithGrade.map(statistic => (
            <tr key={statistic.id} className="rounded-lg text-gray-600 dark:text-gray-400 text-sm leading-normal">
              <td className="py-1 pr-2 text-left">{statistic.subjectName}</td>
              <td className="py-1 px-2 text-right">
                <Badge variant={statistic.grade >= 4 ? 'success' : statistic.grade >= 2 ? 'warning' : 'danger'}>
                  {statistic.grade}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : null
}
