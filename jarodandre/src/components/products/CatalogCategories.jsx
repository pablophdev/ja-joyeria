function CatalogCategories({ categories, selectedCategory, total, onSelect }) {
  const options = [{ value: 'all', label: 'Todos los productos', count: total }, ...categories]

  return (
    <section className="mb-4" aria-labelledby="catalog-categories-title">
      <h3 id="catalog-categories-title" className="h5 mb-3">Categorías</h3>
      <div className="d-flex flex-wrap gap-2">
        {options.map(({ value, label, count }) => (
          <button
            key={value}
            className={`btn ${selectedCategory === value ? 'btn-dark' : 'btn-outline-dark'}`}
            type="button"
            aria-pressed={selectedCategory === value}
            aria-controls="catalog-results"
            onClick={() => onSelect(value)}
          >
            {label} <span className="ms-1">({count})</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default CatalogCategories
