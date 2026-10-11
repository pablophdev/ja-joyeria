import { catalogFilterOptions } from '../../utils/catalogFilters'
import './CatalogFilters.css'

const selectFields = [
  { name: 'group', label: 'Grupo' },
  { name: 'badge', label: 'Etiqueta' },
  { name: 'priceRange', label: 'Precio (CLP)' },
  { name: 'sort', label: 'Ordenar por' },
]

function CatalogFilters({ filters, onFilterChange, onReset }) {
  return (
    <form className="catalog-filters bg-light border rounded p-3 p-md-4" aria-label="Buscar y filtrar productos" onSubmit={(event) => event.preventDefault()}>
      <h3 className="catalog-filters__title">Filtros</h3>
      <div className="mb-3">
        <label className="form-label" htmlFor="catalog-query">Buscar por nombre</label>
        <input
          className="form-control"
          id="catalog-query"
          name="query"
          type="search"
          placeholder="Ej.: anillo, grillz, oro rosa…"
          value={filters.query}
          onChange={(event) => onFilterChange(event.target.name, event.target.value)}
          aria-controls="catalog-results"
          aria-describedby="catalog-search-help"
        />
        <p className="form-text mb-0" id="catalog-search-help">Los resultados se actualizan al escribir. Puedes combinar los filtros.</p>
      </div>
      {selectFields.map(({ name, label }) => (
        <div className="mb-3" key={name}>
          <label className="form-label" htmlFor={`catalog-${name}`}>{label}</label>
          <select
            className="form-select"
            id={`catalog-${name}`}
            name={name}
            value={filters[name]}
            onChange={(event) => onFilterChange(event.target.name, event.target.value)}
            aria-controls="catalog-results"
          >
            {catalogFilterOptions[name].map(({ value, label: optionLabel }) => (
              <option key={value} value={value}>{optionLabel}</option>
            ))}
          </select>
        </div>
      ))}
      <button className="btn btn-outline-light w-100" type="button" onClick={onReset}>Restablecer búsqueda y filtros</button>
    </form>
  )
}

export default CatalogFilters
