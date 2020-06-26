import React from 'react'

import { Flex } from 'lese'
import Navbar from 'Components/Navbar'
import Modal from 'Components/Modal'

import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

export default ({ children }) => (
  <>
    <Flex column width="100%" height="100vh">
      <Navbar />
      {children}
    </Flex>
    <ToastContainer
      position="bottom-right"
      autoClose={6000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    <Modal />
  </>
)
