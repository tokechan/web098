import { useState, useEffect } from 'hono/jsx'

export default function Time() {
  const [time, setTime] = useState(new Date().toLocaleString())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleString())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="time">
      <p>現在時刻: {time}</p>
    </div>
  )
}
