import React from 'react'
import ReloadIcon from './Reload'
import classNames from 'classnames'

export default function (props) {
  return (
    <ReloadIcon {...props} className={classNames(props.className, 'icon-spin text-info')} />
  )
}
