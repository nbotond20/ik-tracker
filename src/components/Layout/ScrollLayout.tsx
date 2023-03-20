interface ScrollLayoutProps {
  children: React.ReactNode
}

export const ScrollLayout = ({ children }: ScrollLayoutProps) => {
  return (
    <div
      data-mobile-max-height
      className="sm:scrollBar flex max-h-[calc(100vh-64px)] min-h-[calc(100vh-64px)] w-full justify-center overflow-auto bg-white dark:bg-gray-900"
    >
      {children}
    </div>
  )
}
