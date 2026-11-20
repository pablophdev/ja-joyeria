import { Component, createRef } from 'react'
import { contentEntrance, contentExit } from '../../utilidades/motion'

export default class TransicionPaso extends Component {
  state = { step: this.props.step, transitioning: false }
  root = createRef()
  cleanup = () => {}

  componentDidMount() {
    this.cleanup = contentEntrance(this.root.current)
    this.motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    this.motionQuery?.addEventListener('change', this.handleMotionChange)
  }

  componentDidUpdate(previousProps) {
    if (previousProps.step === this.props.step) return
    this.cleanup()
    this.setState({ transitioning: true }, () => {
      this.cleanup = contentExit(this.root.current, this.completeTransition)
    })
  }

  handleMotionChange = (event) => {
    if (event.matches && this.state.transitioning) this.completeTransition()
  }

  completeTransition = () => {
    this.cleanup()
    this.setState({ step: this.props.step, transitioning: false }, () => {
      this.cleanup = contentEntrance(this.root.current)
      this.root.current?.focus({ preventScroll: true })
    })
  }

  componentWillUnmount() {
    this.motionQuery?.removeEventListener('change', this.handleMotionChange)
    this.cleanup()
  }

  render() {
    return (
      <div ref={this.root} tabIndex={-1} inert={this.state.transitioning} aria-busy={this.state.transitioning} aria-label={this.state.step === 'delivery' ? 'Datos de entrega' : 'Pago'}>
        {this.props.children(this.state.step)}
      </div>
    )
  }
}
