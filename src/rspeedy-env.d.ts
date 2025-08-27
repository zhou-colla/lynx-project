/// <reference types="@lynx-js/rspeedy/client" />
/// <reference types="@lynx-js/react/typings/jsx" />
/// <reference types="@lynx-js/react" />

declare namespace JSX {
  interface IntrinsicElements {
    view: any
    text: any
    image: any
    input: {
      value?: string
      placeholder?: string
      className?: string
      onInput?: (e: { detail: { value: string } }) => void
    }
    button: {
      className?: string
      bindtap?: () => void
    }
  }
}
