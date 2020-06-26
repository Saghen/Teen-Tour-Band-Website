import React, { useState, useEffect, useMemo } from 'react'
import styled from '@emotion/styled'
import { Flex } from 'lese'

import { runOnEnter } from 'Helpers'

import { colors } from 'Constants'

import { X } from 'react-feather'

import { Icon } from 'react-feather'
import Link from 'Components/shared/Link'

import AutoSuggest from 'react-autosuggest'
import FuzzySearch from 'fuzzy-search'

type InputContainerProps = {
  background?: string
  fullWidth?: boolean
}
const InputContainer = styled(Flex)`
  background-color: ${({ background }: InputContainerProps) => background || colors.background[300]};
  ${({ fullWidth }: InputContainerProps) => fullWidth && 'width: 100%;'}
`

type InputProps = {
  Icon?: Icon
} & React.InputHTMLAttributes<HTMLInputElement>
const Input = styled.input`
  padding: ${({ Icon }: InputProps) => (Icon ? '12px 4px' : '12px')};
  outline: 0;
  border: none;
  background: transparent;
  -webkit-box-shadow: 0 0 0 30px ${colors.background[300]} inset !important; /* eslint-disable-line */
  font-size: 1em;
`

export default ({ Icon, background, fullWidth, ...props }: InputContainerProps & InputProps) => (
  <InputContainer xAlign="flex-start" yAlign background={background} fullWidth={fullWidth}>
    {Icon && <Icon style={{ padding: '12px' }} size="16px" />}
    <Input {...props} />
  </InputContainer>
)

const AutoSuggestStyled = styled.div`
  > div {
    display: flex;
    flex-direction: column;
    position: relative;
  }
  input {
    box-sizing: border-box;
    background-color: ${colors.background[300]};
    -webkit-box-shadow: 0 0 0 30px ${colors.background[300]} inset !important; /* eslint-disable-line */
    color: ${colors.background.text};
    border: none;
    outline: none;
    padding: 12px;
    width: 100%;
  }

  > div > div:empty {
    display: none;
  }

  > div > div {
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    background: #fff;
    z-index: 50;
    border: 1px solid ${colors.background[300]};
    border-top: none;
    max-height: 400px;
    overflow-y: auto;

    > ul {
      background: ${colors.background[300]};
    }

    > ul > li {
      > button {
        text-align: left;
        border: none;
        margin: none;
        outline: none;
        background-color: transparent;
        cursor: pointer;
        padding: 12px 16px;
        width: 100%;
      }

      &:hover,
      &:focus,
      &.react-autosuggest__suggestion--highlighted {
        background: ${colors.background[400]};
      }
    }
  }
`

type AutoCompleteProps = React.HTMLAttributes<HTMLInputElement> & {
  suggestions: string[]
  value: string
  placeholder: string
  onChange(newValue: string)
  onBlur()
}

export const AutoComplete = ({
  suggestions,
  value,
  placeholder,
  onChange,
  onBlur,
  ...props
}: AutoCompleteProps) => {
  const [activeSuggestions, setActiveSuggestions] = useState([])
  const searcher = useMemo(() => new FuzzySearch(suggestions, []), [suggestions])

  useEffect(() => {
    if (value === '' && Array.isArray(suggestions)) setActiveSuggestions(suggestions)
  }, [value, suggestions])
  return (
    <AutoSuggestStyled>
      <AutoSuggest
        suggestions={activeSuggestions}
        renderSuggestion={suggestion => (
          <button
            type="button"
            onClick={() => onChange(suggestion)}
            onKeyDown={runOnEnter(() => onChange(suggestion))}
          >
            {suggestion}
          </button>
        )}
        inputProps={{
          value,
          onChange: (e, { newValue }) => typeof onChange === 'function' && onChange(newValue),
          onBlur: e => typeof onBlur === 'function' && onBlur(),
          placeholder,
          ...props
        }}
        shouldRenderSuggestions={val => suggestions.indexOf(val) === -1}
        getSuggestionValue={val => val}
        onSuggestionsClearRequested={() => setActiveSuggestions([])}
        onSuggestionsFetchRequested={args =>
          setActiveSuggestions(
            searcher
              .search(args.value)
              .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
          )
        }
      />
    </AutoSuggestStyled>
  )
}

type TagProps = {
  backgroundColor?: boolean
  color?: string
  excludeClose?: boolean
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
}

const TagStyle = styled(Flex)`
  padding: 12px;
  text-align: center;
  background-color: ${({ backgroundColor }: TagProps) => backgroundColor || colors.secondary.default};
  color: ${({ color }: TagProps) => color || colors.primary.text};
  margin: 4px;
`

const Tag: React.FC<TagProps> = ({ onClick, children, excludeClose, ...props }) => {
  return (
    <TagStyle {...props} yAlign separation="12px">
      {typeof children === 'string' ? <span>{children}</span> : children}
      {!excludeClose && (
        <Link color={colors.primary.text} onClick={onClick} tabIndex={-1}>
          <X size="16px" />
        </Link>
      )}
    </TagStyle>
  )
}

type TagInfoType = {
  text: string
  [key: string]: any
}

type TagsProps = {
  tags?: TagInfoType[]
  removeTag(i: number)
  excludeClose?: boolean
}

export const Tags: React.FC<TagsProps> = ({ tags, removeTag, excludeClose }) => (
  <Flex wrap yAlign>
    {tags.map((tag, i) => (
      <Tag excludeClose={excludeClose} key={tag.text} onClick={() => removeTag(i)}>
        {tag.text}
      </Tag>
    ))}
  </Flex>
)

export const AutoCompleteTags = ({
  tags,
  removeTag,
  suggestions,
  value,
  placeholder,
  onChange,
  onBlur,
  ...props
}) => {
  return (
    <Flex column separation="8px" xAlign>
      <AutoComplete
        suggestions={suggestions}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      />
      {tags.length > 0 && <Tags tags={tags} removeTag={removeTag} />}
    </Flex>
  )
}
