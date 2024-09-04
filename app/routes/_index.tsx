import { ActionFunctionArgs } from '@remix-run/node'
import { Form, json, redirect } from '@remix-run/react'
import { z } from 'zod'
import { Button } from '~/components/button'
import { Input } from '~/components/input'
import { AccessToken } from 'livekit-server-sdk'
import { env } from '~/lib/env.server'
import { commitSession, getSession } from '~/lib/session.server'

const JoinRoomOptionsSchema = z.object({
  room: z
    .string()
    .regex(/^[a-zA-Z0-9_-]+$/)
    .min(2)
    .max(32),
  username: z.string(),
})

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()

  const parsedJoinRoomOptions = JoinRoomOptionsSchema.safeParse({
    room: formData.get('room'),
    username: formData.get('username'),
  })

  if (!parsedJoinRoomOptions.success) {
    throw json(
      { error: 'Invalid join room options', issues: parsedJoinRoomOptions.error.issues },
      { status: 400, statusText: 'Bad Request' },
    )
  }

  // Create new livekit access token based on the username
  const accessToken = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
    identity: parsedJoinRoomOptions.data.username,
  })

  // Give the access token the ability to join the room
  accessToken.addGrant({
    room: parsedJoinRoomOptions.data.room,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  })

  // Create cookie session and set the access token
  const session = await getSession(request.headers.get('Cookie'))
  session.set('livekit:token', await accessToken.toJwt())

  // Redirect to the room
  throw redirect(`/room/${parsedJoinRoomOptions.data.room}`, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export default function Index() {
  return (
    <main className="p-6">
      <h1>remix-livekit</h1>
      <Form method="POST" className="mt-3 flex gap-x-3">
        <Input
          name="room"
          placeholder="room"
          required
          pattern="[a-zA-Z0-9_-]"
          minLength={1}
          maxLength={32}
        />
        <Input name="username" placeholder="username" required />
        <Button type="submit">join</Button>
      </Form>
    </main>
  )
}
