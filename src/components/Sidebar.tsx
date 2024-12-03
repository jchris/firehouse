import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import { useFireproof } from 'use-fireproof'

import styles from './Sidebar.module.css'
import {ChannelDoc} from "../types.ts";

const Sidebar: React.FC<{ 
  isMobChannelsOpen: boolean,
  onSetIsMobChannelsOpen: (flag: boolean) => void,
  isNewChannelOpen: boolean,
  onSetIsNewChannelOpen : (flag: boolean) => void
}> = ({ isMobChannelsOpen, onSetIsMobChannelsOpen, isNewChannelOpen, onSetIsNewChannelOpen }) => {
  const { useLiveQuery } = useFireproof('_channels')


  const channels = useLiveQuery<ChannelDoc>('name').docs as { name: string; _id: string; description: string }[]

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isNewChannelOpen) {
      e.preventDefault()
      history.go(-1)
      onSetIsNewChannelOpen(false)
    } else {
      onSetIsNewChannelOpen(true)
    }
    onSetIsMobChannelsOpen(false)
  }

  return (
    <div className={styles.sidebarWrap}>
      <Link
        to='/channel'
        onClick={handleClick}
        className={`${styles.newChannelBtn} ${isMobChannelsOpen ? styles.open : ''}`}
      >
        <span className={`${styles.newChannelBtnText} ${isMobChannelsOpen ? styles.open : ''}`}>+ new channel</span>
        <span className={`${styles.newChannelIcon} ${isMobChannelsOpen ? styles.open : ''}`}>
          <NewChannelIconMob />
        </span>
      </Link>
      <h2 className={`${styles.channelsHeading} ${isMobChannelsOpen ? styles.open : ''}`}>channels</h2>
      <SidebarMobNav isMobChannelsOpen={isMobChannelsOpen} onSetIsMobChannelsOpen={onSetIsMobChannelsOpen} />
      <ul className={`${styles.channelList} ${isMobChannelsOpen ? styles.open : ''}`}>
        {channels.sort((a: ChannelDoc, b: ChannelDoc) => b.created! - a.created!).map(channel => (
          <li key={channel._id}>
            <NavLink
              to={`/channel/${channel.name}`}
              className={({ isActive }) => isActive ? `${styles.channel} ${styles.active}` : styles.channel}
              onClick={() => onSetIsMobChannelsOpen(false)}
            >
              <h3 className={styles.channelTitle}>{channel.name}</h3>
              <p className={styles.channelDescr}>{channel.description}</p>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { Sidebar }

const SidebarMobNav: React.FC<{ isMobChannelsOpen: boolean, onSetIsMobChannelsOpen: (flag: boolean) => void }> = ({ isMobChannelsOpen, onSetIsMobChannelsOpen }) => {

  function handleClick() {
    onSetIsMobChannelsOpen(!isMobChannelsOpen)
  }

  return (
    <div
      className={`${styles.openChannelsBtn} ${isMobChannelsOpen ? styles.open : ''}`}
      onClick={handleClick}
    >
      <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.68257 15.38V19.0001L5.13886 18.1263L9.71632 15.38H14.2563C15.3166 15.38 16.1788 14.5178 16.1788 13.4575V5.76753C16.1788 4.70727 15.3166 3.84503 14.2563 3.84503H2.72132C1.66107 3.84503 0.798828 4.70727 0.798828 5.76753V13.4575C0.798828 14.5178 1.66107 15.38 2.72132 15.38H3.68257ZM2.72132 5.76753H14.2563V13.4575H9.18379L5.60507 15.6049V13.4575H2.72132V5.76753Z" fill="#717171"/>
        <path d="M18.1013 0H6.56629C5.50604 0 4.6438 0.862239 4.6438 1.9225H16.1788C17.239 1.9225 18.1013 2.78474 18.1013 3.84499V11.535C19.1615 11.535 20.0238 10.6727 20.0238 9.61248V1.9225C20.0238 0.862239 19.1615 0 18.1013 0Z" fill="#717171"/>
      </svg>
    </div>
  )
}

const NewChannelIconMob: React.FC = () => {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.8 5.2H12C12.5523 5.2 13 5.64771 13 6.2V6.8C13 7.35228 12.5523 7.8 12 7.8H7.8V12C7.8 12.5523 7.35228 13 6.8 13H6.2C5.64772 13 5.2 12.5523 5.2 12V7.8H1C0.447716 7.8 0 7.35228 0 6.8V6.2C0 5.64772 0.447715 5.2 1 5.2H5.2V1C5.2 0.447716 5.64771 0 6.2 0H6.8C7.35228 0 7.8 0.447715 7.8 1V5.2Z" fill="#717171"/>
    </svg>
  )
}
