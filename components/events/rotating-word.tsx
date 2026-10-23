'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const WORDS = ['event', 'booth', 'pictures', 'video', 'online presentation']
const INTERVAL_MS = 2200

export function RotatingWord() {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduceMotion) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % WORDS.length)
    }, INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [reduceMotion])

  const word = reduceMotion ? WORDS[0] : WORDS[index]

  return (
    <span className="relative inline-block whitespace-nowrap border-b-2 border-ev-accent pr-[0.06em] italic">
      {/* Invisible copy keeps the width and height of the current word in the flow. */}
      <span className="invisible">{word}</span>
      <AnimatePresence initial={false}>
        <motion.span
          key={word}
          className="absolute left-0 top-0"
          initial={reduceMotion ? false : { y: '0.45em', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduceMotion ? undefined : { y: '-0.45em', opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
