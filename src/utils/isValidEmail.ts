import { z } from 'zod'

export const isValidEmail = (email: string) => {
  return z.string().email().safeParse(email).success
}
