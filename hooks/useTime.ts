import { useEffect, useState } from "react"
import { DateTime } from "luxon"

export const useTime = (refreshCycle = 1000) => {
  const [now, setNow] = useState(getTime())

  useEffect(() => {
    const intervalId = setInterval(() => setNow(getTime()), refreshCycle)

    return () => clearInterval(intervalId)
  }, [refreshCycle, setInterval, clearInterval, setNow, getTime])

  return now
}

const getTime = () => {
  return DateTime.local()
}
