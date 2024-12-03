import React, { useState } from 'react'

import styles from './MessageForm.module.css'

export const MessageForm: React.FC<{ gravatar: string, handleAddMessage: (message: string) => void }> = ({
  handleAddMessage
}) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleAddMessage(message)
    setMessage('')
  }

  return (
    <form className={styles.messageForm} onSubmit={handleSubmit} autoComplete="off">
      <div className={styles.messageFormIcon}></div>
      <input
        title="write a message message"
        name="message"
        type="text"
        value={message}
        placeholder="Hello world..."
        autoComplete="off"
        className={styles.input}
        onChange={e => setMessage(e.target.value)}
      />
      <button className={styles.messageFormBtn} type="submit">Post</button>
    </form>
  )
}
