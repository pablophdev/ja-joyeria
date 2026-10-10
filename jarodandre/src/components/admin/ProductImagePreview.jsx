import { Component } from 'react'

class ProductImagePreview extends Component {
  state = { failed: false }

  render() {
    if (!this.props.src) return <p className="text-secondary">Selecciona una imagen para ver la vista previa.</p>
    if (this.state.failed) return <p className="text-danger" role="status">No se pudo cargar la imagen. Revisa su ruta o URL.</p>
    return <img className="img-fluid rounded object-fit-contain" style={{ maxHeight: '240px' }} src={this.props.src} alt="Vista previa del producto" onError={() => this.setState({ failed: true })} />
  }
}

export default ProductImagePreview
