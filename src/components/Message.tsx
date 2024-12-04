import React from 'react'
import type { Database } from 'use-fireproof'
import type { MessageDoc, ReactionDoc } from '../types'

import styles from './Message.module.css'

interface MessageProps {
  doc: MessageDoc
  gravatar: string
  reactions: ReactionDoc[]
  database: Database
  thread?: boolean
}

const topReactions = [
  '👍',
  '😂',
  '😍',
  '😭',
  '🔥',
  '🙌',
  '👏',
  '🤔',
  '😢',
  '🎉',
  '💕',
  '🤣',
  '🥺',
  '✨',
  '😒',
  '👀',
  '🙄',
  '🤦‍♂️',
  '🤷‍♀️',
  '👌'
]

const Message: React.FC<MessageProps> = ({ doc, gravatar, database, reactions, thread }) => {
  const { message, max, created, profileImg, _id: mId } = doc
  const date = new Date(created)

  function onEmojiSelect(emoji: string) {
    const reaction: ReactionDoc = {
      type: 'reaction',
      parent: { max, created, id: mId! },
      reaction: emoji,
      profileImg: gravatar
    }
    database.put(reaction)
  }

  return (
    <li className={`message ${styles.listItem}`}>
      <img src={profileImg} alt="gravatar" className={styles.gravatar} />
      <div className={styles.messageWrap}>
        <p className={styles.message}>{message}</p>
        <EmojiPicker onEmojiSelect={onEmojiSelect} />
        {reactions?.map(reaction => (
          <span title={reaction.profileImg} key={reaction._id} className={styles.reaction}>
            {reaction.reaction}
          </span>
        ))}
        {thread && (
          <Link
            style={{ float: 'left', padding: '0 10px', textDecoration: 'none' }}
            to={`./thread/${mId}`}
          >
            🧵
          </Link>
        )}
        <p className={styles.time}>{date.toLocaleTimeString()}</p>
      </div>
      <p className={styles.date}>{date.toLocaleDateString()}</p>
    </li>
  )
}

export { Message }

import { useState } from 'react'
import { Link } from 'react-router-dom'

const EmojiPicker: React.FC<{ onEmojiSelect: (emoji: string) => void }> = ({ onEmojiSelect }) => {
  const [isOpen, setIsOpen] = useState(false)

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (!isOpen) {
      e.stopPropagation()
      setIsOpen(true)

      const targ = e.target
      window.addEventListener('click', (e) => {
        if (e.target === targ) return
        setIsOpen(false)
      }, { once: true })
    } else {
      setIsOpen(false)
    }
  }

  return (
    <div className={styles.pickerWrap}>
      <button className={styles.picker} onClick={handleClick}>{isOpen ? '➖' : '➕'}</button>
      {isOpen && (
        <ul className={styles.reactionBtnWrap}>
          {topReactions.map(emoji => (
            <li
              className={styles.reactionBtn}
              key={emoji}
              onClick={() => {
                setIsOpen(false)
                onEmojiSelect(emoji)
              }}
            >
              {emoji}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Usage example (you can place this inside the Message component or wherever it's needed):
// <EmojiPicker onEmojiSelect={(emoji) => console.log(emoji)} />
