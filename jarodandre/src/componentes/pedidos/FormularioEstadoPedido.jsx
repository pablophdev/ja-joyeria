import { deliveryStatuses, formatOrderId } from '../../datos/orderRecords'

function FormularioEstadoPedido({ order, onSave }) {
  return (
    <form className="d-flex flex-wrap gap-2 mt-2" onSubmit={(event) => {
      event.preventDefault()
      onSave(order.id, event.currentTarget.elements.deliveryStatus.value)
    }}>
      <label className="visually-hidden" htmlFor={`delivery-${order.id}`}>Entrega de {formatOrderId(order.id)}</label>
      <select className="form-select form-select-sm" id={`delivery-${order.id}`} name="deliveryStatus" defaultValue={order.status} disabled={order.paymentStatus !== 'paid'}>
        {Object.keys(deliveryStatuses).map((status) => <option value={status} key={status}>{status}</option>)}
      </select>
      <button className="btn btn-dark btn-sm" type="submit" disabled={order.paymentStatus !== 'paid'} aria-label={`Guardar entrega de ${formatOrderId(order.id)}`}>Guardar entrega</button>
      {order.paymentStatus !== 'paid' && <span className="small text-secondary">Requiere pago realizado.</span>}
    </form>
  )
}

export default FormularioEstadoPedido
