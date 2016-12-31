import React, { Component } from 'react'
import { withRouter } from 'react-router'
import Edit from './Edit'
import { map } from '../utils'
import * as settings from '../models/settings'

const settingsByProperty = {}
map(settings, (key, setting) => {
  settingsByProperty[setting.property] = setting
})

export default class EditSettings extends Edit {
  getModelConfig (params) {
    return settingsByProperty[params.setting]
  }
  getModelPath (property) {
    return `/settings/${property}`
  }
}

export const EditSettingsWithRouter = withRouter(EditSettings)
