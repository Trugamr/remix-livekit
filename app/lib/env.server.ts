import { z } from 'zod'

export const env = z
  .object({
    COOKIE_SECRETS: z.string().transform(value => value.split(',')),
    LIVEKIT_API_KEY: z.string(),
    LIVEKIT_API_SECRET: z.string(),
    LIVEKIT_URL: z.string(),
  })
  .parse(process.env)
