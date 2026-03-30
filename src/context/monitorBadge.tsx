'use client'

import { createContext, useContext, useState } from 'react'

interface MonitorBadgeContextValue {
  waitingCount: number
  setWaitingCount: (n: number) => void
}

const MonitorBadgeContext = createContext<MonitorBadgeContextValue>({
  waitingCount: 0,
  setWaitingCount: () => {},
})

export function MonitorBadgeProvider({ children }: { children: React.ReactNode }) {
  const [waitingCount, setWaitingCount] = useState(0)
  return (
    <MonitorBadgeContext.Provider value={{ waitingCount, setWaitingCount }}>
      {children}
    </MonitorBadgeContext.Provider>
  )
}

export const useMonitorBadge = () => useContext(MonitorBadgeContext)
