import { deliveryStatuses, formatOrderId, paymentStatuses } from '../../datos/orderRecords'
import { formatPrice } from '../../utilidades/formatPrice'

const dateFormatter = new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium', timeStyle: 'short' })

function TarjetaPedido({ order }) {
  const payment = paymentStatuses[order.paymentStatus ?? 'pending']
  return (
    <article className="card mb-4" id={`pedido-${order.id}`}>
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between gap-2">
          <h2 className="h5">{formatOrderId(order.id)}</h2>
          <span className={`badge ${deliveryStatuses[order.status].badge} align-self-start`}>Entrega: {order.status}</span>
        </div>
        <p className="text-secondary"><time dateTime={order.createdAt}>{dateFormatter.format(new Date(order.createdAt))}</time></p>
        <p className="fw-bold">Total: {formatPrice(order.total)}</p>
        <p><span className={`badge ${payment.badge}`}>{payment.label}</span><span className="small text-secondary ms-2">Simulación local</span></p>
        <details>
          <summary className="mb-3">Ver detalle del pedido {formatOrderId(order.id)}</summary>
          <h3 className="h6">Contacto y entrega</h3>
          <p>{order.customer.name} · {order.customer.email}<br />{order.customer.address}, {order.customer.city}</p>
          <div className="table-responsive">
            <table className="table align-middle">
              <caption>Productos del pedido {formatOrderId(order.id)}</caption>
              <thead><tr><th scope="col">Producto</th><th scope="col">Cantidad</th><th scope="col">Precio unitario</th><th scope="col">Subtotal</th></tr></thead>
              <tbody>{order.items.map((item) => (
                <tr key={item.productId}><th scope="row">{item.name}</th><td>{item.quantity}</td><td>{formatPrice(item.price)}</td><td>{formatPrice(item.subtotal)}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </details>
      </div>
    </article>
  )
}

export default TarjetaPedido
