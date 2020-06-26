import React from 'react'

import Input from 'Components/shared/Input'
import { useInput, runOnEnter } from 'Helpers'

import { Flex } from 'lese'
import { colors } from 'Constants'
import { Text } from 'Components/shared/Typography'
import { Button } from 'Components/shared/Button'
import { XCircle } from 'react-feather'

import { ModalCard, closeModal } from './index'

const ConfirmationModal = ({ description, onCancel = closeModal, onConfirm }) => (
  <ModalCard>
    <XCircle strokeWidth="0.5px" color={colors.primary[800]} size="112px" />
    <Text align>{description}</Text>
    <Flex separation="24px">
      <Button color={colors.backgroundInverted.default} onClick={onCancel}>
        Cancel
      </Button>
      <Button color={colors.primary[800]} onClick={onConfirm}>
        Confirm
      </Button>
    </Flex>
  </ModalCard>
)

export default ConfirmationModal

export const ConfirmationModalStrict = ({
  description,
  requiredText,
  onCancel = closeModal,
  onConfirm
}) => {
  const requiredTextHook = useInput('')
  return (
    <ModalCard>
      <XCircle strokeWidth="0.5px" color={colors.primary[800]} size="112px" />
      <Text align>{description}</Text>
      <Text align>
        Please type <em>{requiredText}</em> to confirm
      </Text>
      <Input
        placeholder="Required Text"
        onKeyDown={runOnEnter(() => requiredTextHook.value === requiredText && onConfirm())}
        {...requiredTextHook.bind}
      />
      <Flex separation="24px">
        <Button color={colors.backgroundInverted.default} onClick={onCancel}>
          Cancel
        </Button>
        <Button
          color={colors.primary[800]}
          onClick={onConfirm}
          disabled={requiredTextHook.value !== requiredText}
        >
          Confirm
        </Button>
      </Flex>
    </ModalCard>
  )
}
