import { registrationRegions } from '../../datos/registrationOptions'

const profileFields = [
  { name: 'name', label: 'Nombre completo', type: 'text', autoComplete: 'name', maxLength: 120 },
  { name: 'rut', label: 'RUT / RUN', type: 'text', placeholder: '12345678-5', maxLength: 12 },
  { name: 'email', label: 'Correo electrónico', type: 'email', autoComplete: 'email', maxLength: 254 },
  { name: 'phone', label: 'Teléfono (opcional)', type: 'tel', autoComplete: 'tel', maxLength: 12 },
]

function CamposUsuario({ values, onChange }) {
  const communes = registrationRegions.find((region) => region.value === values.region)?.communes ?? []
  return (
    <div className="row g-3 mb-3">
      {profileFields.map(({ name, label, ...inputProps }) => (
        <div className="col-sm-6" key={name}>
          <label className="form-label" htmlFor={`profile-${name}`}>{label}</label>
          <input {...inputProps} className="form-control" id={`profile-${name}`} name={name} required={name !== 'phone'} value={values[name]} onChange={onChange} />
        </div>
      ))}
      <div className="col-sm-6">
        <label className="form-label" htmlFor="profile-region">Región</label>
        <select className="form-select" id="profile-region" name="region" required value={values.region} onChange={onChange}>
          <option value="">Selecciona la región</option>
          {registrationRegions.map((region) => <option key={region.value} value={region.value}>{region.label}</option>)}
        </select>
      </div>
      <div className="col-sm-6">
        <label className="form-label" htmlFor="profile-commune">Comuna</label>
        <select className="form-select" id="profile-commune" name="commune" required disabled={!values.region} value={values.commune} onChange={onChange}>
          <option value="">Selecciona la comuna</option>
          {communes.map((commune) => <option key={commune} value={commune}>{commune}</option>)}
        </select>
      </div>
    </div>
  )
}

export default CamposUsuario
