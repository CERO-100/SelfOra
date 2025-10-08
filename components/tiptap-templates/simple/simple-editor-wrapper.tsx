"use client"

import dynamic from 'next/dynamic'

const SimpleEditor = dynamic(
  () => import('./simple-editor').then(mod => mod.default),
  { ssr: false }
)

export function SimpleEditorWrapper() {
  return <SimpleEditor />
}