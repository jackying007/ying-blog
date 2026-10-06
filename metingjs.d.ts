declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'meting-js': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        api: string
        server: string
        type: string
        id: string
        fixed?: string
        autoplay?: string
      }
    }
  }
}

export {}
