export const safeNumber = (value: number | null | undefined) => {
  if (Number.isNaN(value)) return 0
  return value ?? 0
}
