import React, { Component } from 'react'
import List from './List'
import { map } from '../utils'
import * as settings from '../models/settings'

const settingsByProperty = {}
map(settings, (key, setting) => {
  settingsByProperty[setting.property] = setting
})

export default class ListSettings extends List {
  getModelConfig (params) {
    return settingsByProperty[params.setting]
  }
  getModelPath (property) {
    return `/settings/${property}`
  }
}
