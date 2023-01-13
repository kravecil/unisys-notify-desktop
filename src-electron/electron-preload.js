import { contextBridge, shell, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('appWindowApi', {
    close: () => {
        ipcRenderer.invoke('showWindow', false)
    },
    show: () => {
        ipcRenderer.invoke('showWindow', true)
    }
})

contextBridge.exposeInMainWorld('appUtil', {
    openLink: (link) => {
        shell.openExternal(link)
    },
    trayLoggedIn: (isLogged = true) => {
        ipcRenderer.invoke('logEvent', isLogged)
    },
})
