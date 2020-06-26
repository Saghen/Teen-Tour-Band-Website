import { render } from 'react-dom'
import React from 'react'

import Router from './router'

import 'reset-css/sass/_reset.scss'
import './styles/globals.scss'

render(<Router />, document.querySelector('#root'))
