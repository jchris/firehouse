import React from 'react'

import styles from './EmailForm.module.css'

export const EmailForm: React.FC<{
  handleSetEmail: (email: string) => void;
  onSetIsEmailOpen: (isOpen: boolean) => void;
}> = ({ handleSetEmail, onSetIsEmailOpen }) => {
  const [email, setEmail] = React.useState('')

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
   if (!(e.target as HTMLDivElement).closest('form')) onSetIsEmailOpen(false)
  }

  return (
    <div className={styles.emailFormWrap} onClick={handleClick}>
      <form className={styles.form}
        onSubmit={e => {
          e.preventDefault()
          handleSetEmail(email)
        }}
      >
        <input
          title="Set your email"
          name="email"
          type="email"
          value={email}
          autoComplete="off"
          className={styles.input}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email for Gravatar image"
        />
        <button className={styles.button} type="submit" disabled={!email}>Login</button>
      </form>
    </div>
  )
}
