import { ChatModal } from '@components/ChatModal/ChatModal'

interface LayoutProps {
  children: React.ReactNode
  Header: React.FC
}

export const Layout = ({ children, Header }: LayoutProps) => {
  return (
    <>
      <Header />
      <main className="flex h-screen max-h-screen min-h-screen flex-col overflow-hidden bg-white pt-16 dark:bg-gray-900">
        {children}
        <ChatModal isOpen={true} />
      </main>
    </>
  )
}
