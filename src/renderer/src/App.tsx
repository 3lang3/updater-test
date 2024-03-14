import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import { useEffect, useState } from 'react'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    window.electron.ipcRenderer.on('message', (_e, txt) => {
      console.log('🚀 ~ window.electron.ipcRenderer.on ~ txt:', txt)
      setMessages((prev) => [...prev, txt])
    })
  }, [])

  return (
    <>
      v1.0.2
      {messages.map((msg, i) => (
        <div key={i}>{msg}</div>
      ))}
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite123</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App
