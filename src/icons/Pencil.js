import React from 'react'
import classNames from 'classnames'

// Open Iconic
// https://github.com/iconic/open-iconic

export default function PencilIcon (props) {
  return (
    <svg viewBox="0 0 8 8" {...props} className={classNames(props.className, 'icon')}>
      <path d="M6 0l-1 1 2 2 1-1-2-2zm-2 2l-4 4v2h2l4-4-2-2z" />
    </svg>
  )
}
