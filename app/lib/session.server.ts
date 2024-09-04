import { createCookieSessionStorage } from '@remix-run/node'
import { env } from './env.server'

type Session = {
  'livekit:token': string
}

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<Session>({
    cookie: {
      name: '_session',
      sameSite: 'lax',
      path: '/',
      httpOnly: true,
      secrets: env.COOKIE_SECRETS,
    },
  })
