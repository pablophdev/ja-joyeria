import { getProductCategoryKey } from './productCategories'

export const defaultCatalogFilters = {
  query: '',
  category: 'all',
  group: 'all',
  badge: 'all',
  priceRange: 'all',
  sort: 'default',
}

export const catalogFilterOptions = {
  group: [
    { value: 'all', label: 'Todos' },
    { value: 'new', label: 'Nuevos' },
    { value: 'popular', label: 'Populares' },
  ],
  badge: [
    { value: 'all', label: 'Todas' },
    { value: 'Nuevo', label: 'Nuevo' },
    { value: 'Oferta', label: 'Oferta' },
  ],
  priceRange: [
    { value: 'all', label: 'Todos los precios' },
    { value: 'under-100000', label: 'Menos de $100.000' },
    { value: '100000-200000', label: '$100.000 a $200.000' },
    { value: 'over-200000', label: 'Más de $200.000' },
  ],
  sort: [
    { value: 'default', label: 'Orden original' },
    { value: 'price-asc', label: 'Precio: menor a mayor' },
    { value: 'price-desc', label: 'Precio: mayor a menor' },
    { value: 'name-asc', label: 'Nombre: A a Z' },
    { value: 'name-desc', label: 'Nombre: Z a A' },
  ],
}

function normalizeSearch(value) {
  const withoutAccents = value.normalize('NFD').replace(/\p{Diacritic}/gu, '')
  return withoutAccents.toLocaleLowerCase('es').trim()
}

export function filterCatalogProducts(products, filters = defaultCatalogFilters) {
  const selected = { ...defaultCatalogFilters, ...filters }
  const terms = normalizeSearch(selected.query).split(/\s+/u)

  const visibleProducts = products.filter((product) => {
    const name = normalizeSearch(product.name)
    for (const term of terms) {
      if (!name.includes(term)) return false
    }

    if (selected.category !== 'all' && getProductCategoryKey(product) !== selected.category) return false
    if (selected.group !== 'all' && product.group !== selected.group) return false
    if (selected.badge !== 'all' && product.badge !== selected.badge) return false
    if (selected.priceRange === 'under-100000' && product.price >= 100000) return false
    if (selected.priceRange === '100000-200000' && (product.price < 100000 || product.price > 200000)) return false
    if (selected.priceRange === 'over-200000' && product.price <= 200000) return false

    return true
  })

  if (selected.sort === 'price-asc') {
    visibleProducts.sort((first, second) => first.price - second.price)
  } else if (selected.sort === 'price-desc') {
    visibleProducts.sort((first, second) => second.price - first.price)
  } else if (selected.sort === 'name-asc') {
    visibleProducts.sort((first, second) => first.name.localeCompare(second.name, 'es', { sensitivity: 'base', numeric: true }))
  } else if (selected.sort === 'name-desc') {
    visibleProducts.sort((first, second) => second.name.localeCompare(first.name, 'es', { sensitivity: 'base', numeric: true }))
  }

  return visibleProducts
}
