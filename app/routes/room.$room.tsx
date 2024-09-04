import { json, LoaderFunctionArgs } from '@remix-run/node'
import { getSession } from '~/lib/session.server'
import { invariant } from '@epic-web/invariant'
import { useLoaderData } from '@remix-run/react'
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react'
import '@livekit/components-styles'
import { Track } from 'livekit-client'
import { env } from '~/lib/env.server'

export async function loader({ request, params }: LoaderFunctionArgs) {
  invariant(params.room, 'room should be defined')

  const session = await getSession(request.headers.get('Cookie'))
  const token = session.get('livekit:token')
  if (!token) {
    throw json({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' })
  }

  // TODO: Additional checks to ensure token is valid and user can access room

  return json({ room: params.room, token, serverUrl: env.LIVEKIT_URL })
}

export default function Room() {
  const loaderData = useLoaderData<typeof loader>()

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={loaderData.token}
      serverUrl={loaderData.serverUrl}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      style={{ height: '100dvh' }}
    >
      {/* Your custom component with basic video conferencing functionality. */}
      <MyVideoConference />
      {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
      <RoomAudioRenderer />
      {/* Controls for the user to start/stop audio, video, and screen
    share tracks and to leave the room. */}
      <ControlBar />
    </LiveKitRoom>
  )
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  )
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}
    >
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  )
}
