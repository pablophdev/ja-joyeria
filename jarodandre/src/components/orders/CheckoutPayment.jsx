import { formatPrice } from '../../utils/formatPrice'

function CheckoutPayment({ customer, total, disabled, onPay, onCancel, onEdit }) {
  return (
    <section className="border rounded p-4 mt-4" aria-labelledby="checkout-payment-title">
      <h2 id="checkout-payment-title" className="h5">Finalizar pago</h2>
      <dl className="mt-4">
        <dt>Contacto</dt>
        <dd>{customer.name}<br />{customer.email}</dd>
        <dt>Entrega</dt>
        <dd>{customer.address}, {customer.city}</dd>
        <dt>Total a pagar</dt>
        <dd className="fs-3 fw-bold">{formatPrice(total)}</dd>
      </dl>
      <button className="btn btn-outline-dark btn-sm mb-4" type="button" onClick={onEdit}>Editar datos de entrega</button>
      <p className="small text-secondary" id="checkout-payment-note">Versión local de demostración: no se efectuarán cargos reales.</p>
      <div className="d-grid gap-3">
        <button className="btn btn-dark" type="button" disabled={disabled} onClick={onPay} aria-describedby="checkout-payment-note">Pagar {formatPrice(total)}</button>
        <button className="btn btn-outline-dark" type="button" disabled={disabled} onClick={onCancel}>Cancelar pago</button>
      </div>
    </section>
  )
}

export default CheckoutPayment
