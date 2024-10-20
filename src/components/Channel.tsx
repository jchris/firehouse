import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import gravatar from 'gravatar'

import { useFireproof } from 'use-fireproof'
import { connect } from '@fireproof/cloud'
import { Message } from './Message'
import { MessageForm } from './MessageForm'
import usePartySocket from 'partysocket/react'

import type { MessageDoc, ReactionDoc } from '../types'

export const styles = {
  messages: {
    display: 'flex',
    flexDirection: 'column-reverse' as const
  },
  channelOuter: {
    overflowY: 'auto' as const,
    scrollBehavior: 'smooth' as const,
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
}

const Thread: React.FC = () => {
  const { id, tid } = useParams<{ id: string; tid: string }>()
  const { useDocument } = useFireproof(id)
  const [doc] = useDocument<MessageDoc>(() => ({ _id: tid! } as MessageDoc))
  return <InnerChannel key={tid} id={tid || ''} thread={doc} />
}

const Channel: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  return <InnerChannel key={id} id={id || ''} />
}

const InnerChannel: React.FC<{ id: string; thread?: MessageDoc }> = ({ id, thread }) => {
  const { database, useDocument, useLiveQuery } = useFireproof(id)

  // x@ts-expect-error does not exist
  // connect(database)

  const socket = usePartySocket({
    room: id,
    onMessage(evt) {
      console.log('Received message:', evt.data)
    }
  })

  const [email, setEmail] = useState<string | null>(localStorage.getItem('email'))
  const gravatarUrl = email ? gravatar.url(email) : ''

  const [doc, setDoc, saveDoc] = useDocument<MessageDoc>(() => ({
    type: 'message',
    max: 0,
    profileImg: gravatarUrl,
    created: Date.now(),
    message: ''
  }))

  // @ts-expect-error does not exist
  const messages = useLiveQuery(({ created, type }) => (type === 'message' ? created : undefined), {
    descending: true,
    limit: 50
  })

  const reactions = useLiveQuery(
    // @ts-expect-error does not exist
    ({ parent, type }) => (type === 'reaction' ? parent.id : undefined),
    { keys: messages.docs.map(({ _id }) => _id!) }
  )

  const groupedReactions = reactions.rows.reduce((acc: Record<string, ReactionDoc[]>, row) => {
    const key = row.key as string
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(row.doc as ReactionDoc)
    return acc
  }, {} as Record<string, ReactionDoc[]>)

  const handleAddMessage = (message: string) => {
    if (message.trim() !== '') {
      doc.message = message
      doc.created = Date.now()
      doc.profileImg = gravatarUrl
      doc.max =
        1 +
        Math.max(
          (messages.docs as MessageDoc[]).sort((a, b) => b.created - a.created)[0]?.created || 0,
          doc.created
        )
      saveDoc(doc)
      setDoc()
    } else {
      socket.send('Please enter a message')
    }
  }

  const scrollableDivRef = useRef<
    HTMLDivElement & { scrollTo: (options: { top: number; behavior: 'smooth' }) => void }
  >(null)
  function scrollTo() {
    scrollableDivRef.current?.scrollTo({
      top: scrollableDivRef.current.scrollHeight
      // behavior: 'smooth'
    })
  }

  useEffect(scrollTo, [messages.docs.length])

  const channelName = thread ? thread.message : id

  return (
    <>
      { email && (
        <div ref={scrollableDivRef} style={styles.channelOuter}>
          <div style={{flexGrow: '1'}}>
            <ul style={styles.messages}>
              {messages.docs.map(doc => {
                const reactions = groupedReactions[doc._id!]
                return (
                  <Message
                    key={doc._id}
                    doc={doc as MessageDoc}
                    gravatar={gravatarUrl}
                    database={database}
                    reactions={reactions as ReactionDoc[]}
                    thread={false && !thread}
                  />
                )
              })}
            </ul>
          </div>
          <MessageForm handleAddMessage={handleAddMessage} gravatar={gravatarUrl} />
        </div>
      )}
    </>
  )

}

export { Channel, Thread }
