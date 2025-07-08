"use-client";
import React, { useState } from 'react'
import { motion } from 'framer-motion'

const DisclaimerBar = () => {
  const [isPaused, setIsPaused] = useState(false)

  const message = `
    ⚠️ Never share your OTP or password. Bank employees will never ask for it. |
    🛡️ Beware of fraud calls and phishing links. For any help, call our helpline: +91-1800 000 000 (24x7) |
    🛠️ Scheduled maintenance: Every Saturday, 2 AM - 5 AM. |
    💡 Tip: Avoid clicking on suspicious links. Type URLs manually. |
    🔐 Use strong, unique passwords and update them regularly.
  `.replace(/\s+\|\s+/g, ' | ') // Clean up spacing around pipes

  return (
    <div
      className="h-10 border-b py-2 bg-black text-white text-sm font-medium overflow-hidden w-full relative mt-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        className="flex whitespace-nowrap absolute"
        animate={{ x: ['0%', '-100%'] }}
        transition={{
          repeat: Infinity,
          duration: 60,
          ease: 'linear',
        }}
        style={{
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      >
        {/* Duplicate for smooth seamless effect */}
        <span className="px-4">{message}</span>
        <span className="px-4">{message}</span>
      </motion.div>
    </div>
  )
}

export default DisclaimerBar
