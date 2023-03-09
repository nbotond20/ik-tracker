interface ScrollLayoutProps {
  children: React.ReactNode
}

export const ScrollLayout = ({ children }: ScrollLayoutProps) => {
  return (
    <div className="sm:scrollBar flex max-h-[calc(100dvh-64px)] min-h-[calc(100dvh-64px)] w-full justify-center overflow-auto bg-white dark:bg-gray-900">
      {children}
    </div>
  )
}
