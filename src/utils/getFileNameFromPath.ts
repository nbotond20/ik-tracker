export const getFileNameFromPath = (path: string) => {
  return path.split('\\').pop()?.split('/').pop()
}
