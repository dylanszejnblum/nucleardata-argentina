import React from 'react'

import type { Props } from './types'

import { ImageMedia } from './ImageMedia'
import { VideoMedia } from './VideoMedia'

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = 'div', resource } = props

  const isVideo = typeof resource === 'object' && resource?.mimeType?.includes('video')
  const content = isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />

  if (!htmlElement) return <>{content}</>

  // Dynamic intrinsic tag — React 19's stricter children inference can't narrow
  // the ElementType union, so we cast locally (Payload media utility).
  const Tag = htmlElement as unknown as 'div'
  return <Tag className={className}>{content}</Tag>
}
