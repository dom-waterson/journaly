import React, { useEffect, useRef } from 'react'
import TextArea from '@/components/Textarea'
import { useUserSearchLazyQuery } from '@/generated/graphql'

export const MENTION_KEY_CHAR = '@'

const MarkdownEditor = (props: React.ComponentProps<typeof TextArea>) => {
  const textExpanderRef = useRef()
  const [getUsers] = useUserSearchLazyQuery()

  useEffect(() => {
    import('@github/text-expander-element')

    const handleTextExpanderChange = (event: any) => {
      const { key, provide, text } = event.detail
      if (key !== MENTION_KEY_CHAR) return
      provide(
        (async () => {
          const { data } = await getUsers({ variables: { search: text } })

          if (!data?.users)
            return

          const { users } = data
          const fragment = document.createElement('ul')
          fragment.classList.add('user-name-search')
          users.forEach((user) => {
            const el = document.createElement('li')
            el.role = 'option'
            el.dataset.value = user.id.toString()
            el.textContent = user.handle

            fragment.appendChild(el)
          })

          return {
            fragment,
            matched: users.length,
          }
        })(),
      )
    }

    if (textExpanderRef.current) {
      textExpanderRef.current.addEventListener('text-expander-change', handleTextExpanderChange)
    }
  }, [])

  return (
    // TODO: In the future, we could potentially use `#` for the `multiword` arg
    // as a way to mention Groups?
    <div className="text-expander-container">
      <text-expander keys={MENTION_KEY_CHAR} ref={textExpanderRef}>
        <TextArea {...props} />
      </text-expander>
      <style jsx>
        {`
          .text-expander-container {
            position: relative;
          }

          .text-expander-container > :global(:first-child) {
            display: block;
          }

          :global(.user-name-search) {
            margin-top: 24px;
            position: absolute;
            z-index: 1;
            background: white;
            border: 1px solid black;
            border-radius: 5px;
            min-width: 250px;
          }
        `}
      </style>
    </div>
  )
}

export default MarkdownEditor
