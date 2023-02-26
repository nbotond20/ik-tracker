import { ScrollLayout } from '@components/Layout/ScrollLayout'
import type { NextPage } from 'next'

const DashBoardPage: NextPage = () => {
  return (
    <ScrollLayout>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-4xl font-bold">Dashboard</h1>
      </div>
    </ScrollLayout>
  )
}

export default DashBoardPage
