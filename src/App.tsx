import './styles.css'

import React, { useState } from 'react'

import { Route, Routes } from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom'

import { Home } from './components/Home'
import { Channel, Thread } from './components/Channel'
import { NewChannel } from './components/NewChannel'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'

import styles from './index.module.css'

function Layout({
                    children,
                    email,
                    onSetEmail,
                    isMobChannelsOpen,
                    onSetIsMobChannelsOpen,
                    isNewChannelOpen,
                    onSetIsNewChannelOpen
                }: {
    children: React.ReactNode,
    email: string,
    onSetEmail: (email: string) => void,
    isMobChannelsOpen: boolean,
    onSetIsMobChannelsOpen: (flag: boolean) => void,
    isNewChannelOpen: boolean,
    onSetIsNewChannelOpen: (flag: boolean) => void })
{

    return (
        <>
            <Header email={email} onSetEmail={onSetEmail} />
            {email ? (
                <div className={styles.layoutWrap}>
                    <div className={`${styles.layoutSidebar} ${isMobChannelsOpen ? styles.open : ''}`}>
                        <Sidebar
                            isMobChannelsOpen={isMobChannelsOpen}
                            onSetIsMobChannelsOpen={onSetIsMobChannelsOpen}
                            isNewChannelOpen={isNewChannelOpen}
                            onSetIsNewChannelOpen={onSetIsNewChannelOpen}
                        />
                    </div>
                    <div className={styles.layoutMain}>{children}</div>
                </div>
            ) : (
                <Home />
            )}
        </>
    )}

function App() {
    const [email, setEmail] = useState<string | null>(localStorage.getItem('email'))
    const [isMobChannelsOpen, setIsMobChannelsOpen] = useState(false)
    const [isNewChannelOpen, setIsNewChannelOpen] = useState(false)

    const routes = [
        { path: '/channel/:id/thread/:tid', component: <Thread /> },
        { path: '/channel/:id', component: <Channel /> },
        { path: '/channel', component: <NewChannel onSetIsNewChannelOpen={setIsNewChannelOpen} /> },
        { path: '/', component: <Home /> }
    ]

    return (
        <Router>
            <Routes>
                {routes.map(({ path, component }, index) => (
                    <Route key={index} path={path} element={(
                        <Layout
                            email={email ? email : ''}
                            onSetEmail={setEmail}
                            isMobChannelsOpen={isMobChannelsOpen}
                            onSetIsMobChannelsOpen={setIsMobChannelsOpen}
                            isNewChannelOpen={isNewChannelOpen}
                            onSetIsNewChannelOpen={setIsNewChannelOpen}
                        >{component}</Layout>
                    )}/>
                ))}
            </Routes>
        </Router>
    )
}

//createRoot(document.getElementById('app')!).render(<App />)

export default App