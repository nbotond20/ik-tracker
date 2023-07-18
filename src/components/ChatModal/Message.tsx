type MessageProps = {
  isMine?: boolean
  message?: string
  children?: React.ReactNode
}

export const Message = ({ message, isMine, children }: MessageProps) => {
  const className = isMine
    ? 'flex ml-10 justify-end p-2 rounded-lg rounded-br-none bg-gray-400 w-fit self-end'
    : 'flex mr-10 bg-gray-300 p-2 rounded-lg rounded-bl-none w-fit'

  return <div className={className}>{message ? message : children}</div>
}
