import React from 'react'

type Props<T = {}> = {
  fallbackProps: T
  FallbackComponent: React.FC<T>
} | {
  fallbackProps?: never
  FallbackComponent?: never
}

type State = {
  hasError: boolean
}

class GenericErrorBoundary<T> extends React.Component<Props<T>, State> {
  constructor(props: Props<T>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {

      if (this.props.FallbackComponent) {
        const { FallbackComponent, fallbackProps } = this.props
        return <FallbackComponent {...fallbackProps} />
      }

      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again?
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default GenericErrorBoundary
