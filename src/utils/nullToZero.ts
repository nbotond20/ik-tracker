export const safeNumber = (value: number | null | undefined) => {
  if (value === null) return 0
  if (value === undefined) return 0
  if (value === Infinity) return 0
  if (value === -Infinity) return 0
  if (typeof value !== 'number') return 0
  if (Number.isNaN(value)) return 0
  return value ?? 0
}
