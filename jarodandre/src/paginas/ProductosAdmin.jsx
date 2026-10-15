import { Component } from 'react'
import { Link } from 'react-router-dom'
import { deleteProduct, getProducts, subscribeToProducts } from '../datos/products'
import { filterCatalogProducts } from '../utilidades/catalogFilters'
import { formatPrice } from '../utilidades/formatPrice'
import { getAdminProductEditPath, getProductDetailsPath, routes } from '../navigation/routes'

class ProductosAdmin extends Component {
  state = { products: getProducts(), query: '', error: '', message: '' }

  componentDidMount() {
    this.unsubscribe = subscribeToProducts(this.refreshProducts)
    this.refreshProducts()
  }

  componentWillUnmount() { this.unsubscribe?.() }

  refreshProducts = () => this.setState({ products: getProducts() })

  handleDelete = (product) => {
    try {
      deleteProduct(product.id)
      this.setState({ error: '', message: `${product.name} se eliminó del catálogo local. Los pedidos anteriores conservan sus datos.` })
    } catch (error) { this.setState({ error: error.message, message: '' }) }
  }

  render() {
    const { products, query, error, message } = this.state
    const visibleProducts = filterCatalogProducts(products, { query })
    return (
      <section>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"><h1 className="mb-0">Gestión de productos</h1><Link className="btn btn-dark" to={routes.adminProductNew}>Nuevo producto</Link></div>
        {error && <p className="alert alert-danger" role="alert">{error}</p>}
        <p className="text-success" role="status">{message}</p>
        <label className="form-label" htmlFor="admin-product-search">Buscar por nombre</label>
        <input className="form-control mb-3" id="admin-product-search" type="search" value={query} onChange={(event) => this.setState({ query: event.target.value })} aria-controls="admin-product-list" />
        <p className="text-secondary" role="status">Mostrando {visibleProducts.length} de {products.length} productos</p>
        <div id="admin-product-list">
          {!visibleProducts.length ? <p className="bg-light p-4 rounded">{products.length ? 'No hay coincidencias con esta búsqueda.' : 'Todavía no hay productos. Crea el primero desde Nuevo producto.'}</p> : (
            <div className="table-responsive"><table className="table align-middle">
              <caption>Productos guardados en el catálogo local</caption>
              <thead><tr><th scope="col">Producto</th><th scope="col">Precio</th><th scope="col">Disponibilidad</th><th scope="col">Destacado</th><th scope="col">Acciones</th></tr></thead>
              <tbody>{visibleProducts.map((product) => (
                <tr key={product.id}>
                  <th scope="row"><div className="d-flex align-items-center gap-2"><img className="rounded object-fit-cover" src={product.image} alt="" width="56" height="56" loading="lazy" /><div>{product.name}<span className="d-block text-secondary fw-normal">#{product.id}</span></div></div></th>
                  <td className="text-nowrap">{formatPrice(product.price)}</td><td>{product.availability || 'Por consultar'}</td><td>{product.featured ? 'Sí' : 'No'}</td>
                  <td><div className="d-flex flex-wrap gap-2">
                    <Link className="btn btn-outline-dark btn-sm" to={getProductDetailsPath(product.id)} aria-label={`Ver ${product.name}`}>Ver</Link>
                    <Link className="btn btn-dark btn-sm" to={getAdminProductEditPath(product.id)} aria-label={`Editar ${product.name}`}>Editar</Link>
                    <button className="btn btn-outline-danger btn-sm" type="button" onClick={() => this.handleDelete(product)} aria-label={`Eliminar ${product.name}`}>Eliminar</button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table></div>
          )}
        </div>
      </section>
    )
  }
}

export default ProductosAdmin
