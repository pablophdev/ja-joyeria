import { formatOrderId, formatReceiptId, paymentStatuses } from '../../datos/orderRecords'
import { formatPrice } from '../../utilidades/formatPrice'
import './BoletaPedido.css'

const dateFormatter = new Intl.DateTimeFormat('es-CL', { dateStyle: 'long', timeStyle: 'short' })

function BoletaPedido({ order }) {
  const paid = order.paymentStatus === 'paid'
  const payment = paymentStatuses[order.paymentStatus]

  return (
    <article className="order-receipt border rounded p-3 p-md-4">
      <header className="d-flex flex-wrap justify-content-between gap-3 border-bottom pb-3 mb-4">
        <div><p className="h3">jarodandre</p><p className="mb-0">Joyería · Santiago, Chile</p></div>
        <div>
          <h1 className="h4">{paid ? `Boleta ${formatReceiptId(order.id)}` : `Orden ${formatOrderId(order.id)}`}</h1>
          <p className="mb-1">Orden: {formatOrderId(order.id)}</p>
          <time dateTime={order.createdAt}>{dateFormatter.format(new Date(order.createdAt))}</time>
        </div>
      </header>
      <div className="row g-4 mb-4">
        <section className="col-sm-7" aria-labelledby="receipt-customer-title">
          <h2 className="h6" id="receipt-customer-title">Cliente y entrega</h2>
          <p className="mb-1 fw-bold">{order.customer.name}</p>
          <p className="mb-1">{order.customer.email}</p>
          <p className="mb-0">{order.customer.address}, {order.customer.city}</p>
        </section>
        <section className="col-sm-5" aria-labelledby="receipt-payment-title">
          <h2 className="h6" id="receipt-payment-title">Estado del pago</h2>
          <p><span className={`badge ${payment.badge}`}>{payment.label}</span></p>
          <p>Estado de entrega: {order.status}</p>
          <p className="small mb-0">{paid ? 'Compra registrada en el checkout local.' : 'Esta orden no tiene una boleta de pago realizado.'}</p>
        </section>
      </div>
      <div className="table-responsive">
        <table className="table align-middle">
          <caption>Detalle de productos de {formatOrderId(order.id)}</caption>
          <thead><tr><th scope="col">Producto</th><th scope="col" className="text-end">Cantidad</th><th scope="col" className="text-end">Precio unitario</th><th scope="col" className="text-end">Subtotal</th></tr></thead>
          <tbody>{order.items.map((item) => (
            <tr key={item.productId}>
              <th scope="row">{item.name}</th><td className="text-end">{item.quantity}</td><td className="text-end text-nowrap">{formatPrice(item.price)}</td><td className="text-end text-nowrap">{formatPrice(item.subtotal)}</td>
            </tr>
          ))}</tbody>
          <tfoot><tr><th scope="row" colSpan="3" className="text-end">Total de la orden</th><td className="text-end fw-bold text-nowrap">{formatPrice(order.total)}</td></tr></tfoot>
        </table>
      </div>
      <p className="text-end fs-5 fw-bold">Total pagado: {formatPrice(paid ? order.total : 0)}</p>
      <p className="small mb-1">Importes en pesos chilenos. Sin gastos de envío ni descuentos.</p>
      <p className="small text-secondary mb-0">Comprobante del proyecto local · No se realizó un cobro real.</p>
    </article>
  )
}

export default BoletaPedido
