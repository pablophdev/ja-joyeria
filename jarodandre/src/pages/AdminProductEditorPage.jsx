import { Component } from 'react'
import { Link } from 'react-router-dom'
import { createProduct, getProductById, subscribeToProducts, updateProduct } from '../data/products'
import { getProductFormData, getProductFormValues } from '../utils/productForm'
import { getAdminProductEditPath, getProductDetailsPath, routes } from '../navigation/routes'
import ProductForm from '../components/admin/ProductForm'

function findProduct(id) {
  return /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id)) ? getProductById(Number(id)) : null
}

class AdminProductEditorPage extends Component {
  state = { product: this.props.productId ? findProduct(this.props.productId) : null, values: getProductFormValues(this.props.productId ? findProduct(this.props.productId) : null), error: '', message: '', createdId: null }
  saving = false

  componentDidMount() {
    this.unsubscribe = subscribeToProducts(this.refreshProduct)
    this.refreshProduct()
  }

  componentWillUnmount() { this.unsubscribe?.() }

  refreshProduct = () => {
    if (!this.props.productId) return
    const product = findProduct(this.props.productId)
    this.setState((state) => JSON.stringify(product) === JSON.stringify(state.product) ? null : { product, values: getProductFormValues(product) })
  }

  handleChange = (event) => {
    const { name, value, type, checked } = event.target
    this.setState(({ values }) => ({ values: { ...values, [name]: type === 'checkbox' ? checked : value }, error: '', message: '' }))
  }

  handleSubmit = (event) => {
    event.preventDefault()
    if (this.saving || this.state.createdId) return
    this.saving = true
    try {
      const data = getProductFormData(this.state.values)
      const product = this.props.productId ? updateProduct(Number(this.props.productId), data) : createProduct(data)
      if (!product) throw new Error('El producto ya no existe.')
      this.setState({ product, values: getProductFormValues(product), error: '', message: this.props.productId ? 'Cambios guardados correctamente.' : 'Producto creado correctamente.', createdId: this.props.productId ? null : product.id })
    } catch (error) { this.setState({ error: error.message, message: '' }) }
    finally { this.saving = false }
  }

  render() {
    const { product, values, error, message, createdId } = this.state
    if (this.props.productId && !product) return <section><h1>Producto no encontrado</h1><p>El producto no existe o fue eliminado.</p><Link className="btn btn-dark" to={routes.adminProducts}>Volver a productos</Link></section>
    return (
      <section>
        <h1>{this.props.productId ? 'Editar producto' : 'Nuevo producto'}</h1>
        {this.props.productId && <p>Producto #{product.id}: {product.name}</p>}
        {error && <p className="alert alert-danger" role="alert">{error}</p>}
        <p className="text-success" role="status">{message}</p>
        {createdId ? (
          <div className="d-flex flex-wrap gap-2">
            <Link className="btn btn-dark" to={getProductDetailsPath(createdId)}>Ver producto</Link>
            <Link className="btn btn-outline-dark" to={getAdminProductEditPath(createdId)}>Editar producto</Link>
            <button className="btn btn-outline-dark" type="button" onClick={() => this.setState({ product: null, values: getProductFormValues(), createdId: null, message: '', error: '' })}>Crear otro producto</button>
          </div>
        ) : <ProductForm values={values} onChange={this.handleChange} onSubmit={this.handleSubmit} isEditing={Boolean(this.props.productId)} />}
        <Link className="d-inline-block mt-4" to={routes.adminProducts}>Volver a la gestión de productos</Link>
      </section>
    )
  }
}

export default AdminProductEditorPage
