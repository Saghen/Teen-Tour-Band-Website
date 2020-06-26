import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { colors } from 'Constants'

import EventEmitter from 'Helpers/event-emitter'

import { Flex, FlexProps } from 'lese'

type ModalProps = FlexProps & React.HTMLAttributes<HTMLDivElement>

const Modal = styled(Flex)<ModalProps>`
  position: fixed;
  z-index: 1000;
  height: 100%;
  width: 100%;
  top: 0;
  background: rgba(0, 0, 0, 0.2);

  > * {
    z-index: 999;
  }
`

const ModalClickArea = styled.div<React.HTMLAttributes<HTMLDivElement>>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

export const modalEventEmitter = new EventEmitter()

type addModalFunction = (modal: React.ReactNode) => void
type removeModalFunction = () => void
type modalsArray = React.ReactNode[]
type useModalFunction = () => [modalsArray, removeModalFunction, addModalFunction]

const useModal: useModalFunction = () => {
  const [modals, setModals] = useState<modalsArray>([])
  const removeModal: removeModalFunction = () => {
    setModals(modals.slice(0, modals.length - 1))
  }
  const addModal: addModalFunction = modal => setModals([...modals, modal])

  return [modals, removeModal, addModal]
}

export default () => {
  const [modals, removeModal, addModal] = useModal()

  useEffect(() => {
    const modalPushListener = e => addModal(e.component as React.ReactNode)

    modalEventEmitter.on('close', removeModal)
    modalEventEmitter.on('create', modalPushListener)
    window.addEventListener('popstate', removeModal)
  }, [])

  return (
    <>
      {modals.map(component => (
        <Modal relative xAlign="space-around" yAlign>
          <ModalClickArea onClick={removeModal} />
          {component}
        </Modal>
      ))}
    </>
  )
}

export const createModal = component => {
  modalEventEmitter.emit('create', { component })
}

export const closeModal = () => {
  modalEventEmitter.emit('close')
}

const ModalCard = styled(Flex)`
  position: relative;
  background-color: ${colors.background.default};
  padding: 32px;
`
ModalCard.defaultProps = { column: true, separation: '24px', xAlign: true }

export { ModalCard }
