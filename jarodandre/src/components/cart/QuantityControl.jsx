import { MAX_CART_QUANTITY } from '../../data/cart'

function QuantityControl({ id, quantity, onChange, label = 'Cantidad', disabled = false }) {
  return (
    <div>
      <label className="form-label" htmlFor={id}>{label}</label>
      <div className="input-group flex-nowrap">
        <button className="btn btn-outline-dark" type="button" aria-label={`Reducir ${label.toLowerCase()}`} disabled={disabled || quantity <= 1} onClick={() => onChange(quantity - 1)}>−</button>
        <select className="form-select" id={id} value={quantity} disabled={disabled} onChange={(event) => onChange(Number(event.target.value))}>
          {Array.from({ length: MAX_CART_QUANTITY }, (_, index) => index + 1).map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
        <button className="btn btn-outline-dark" type="button" aria-label={`Aumentar ${label.toLowerCase()}`} disabled={disabled || quantity >= MAX_CART_QUANTITY} onClick={() => onChange(quantity + 1)}>+</button>
      </div>
    </div>
  )
}

export default QuantityControl
