import { getProductCategoryKey } from './productCategories'

export const defaultCatalogFilters = Object.freeze({
  query: '',
  category: 'all',
  group: 'all',
  badge: 'all',
  priceRange: 'all',
  sort: 'default',
})

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

const nameCollator = new Intl.Collator('es', { sensitivity: 'base', numeric: true })

const priceRanges = {
  all: () => true,
  'under-100000': (price) => price < 100000,
  '100000-200000': (price) => price >= 100000 && price <= 200000,
  'over-200000': (price) => price > 200000,
}

const sortComparators = {
  'price-asc': (first, second) => first.price - second.price,
  'price-desc': (first, second) => second.price - first.price,
  'name-asc': (first, second) => nameCollator.compare(first.name, second.name),
  'name-desc': (first, second) => nameCollator.compare(second.name, first.name),
}

function normalizeSearch(value) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('es').trim()
}

export function filterCatalogProducts(products, filters = defaultCatalogFilters) {
  const { query, category, group, badge, priceRange, sort } = { ...defaultCatalogFilters, ...filters }
  const terms = normalizeSearch(query).split(/\s+/u).filter(Boolean)
  const matchesPrice = priceRanges[priceRange] ?? priceRanges.all

  // filter crea una nueva lista: ordenar la vista no modifica la fuente de datos.
  const visibleProducts = products.filter((product) => {
    const name = normalizeSearch(product.name)
    return terms.every((term) => name.includes(term))
      && (category === 'all' || getProductCategoryKey(product) === category)
      && (group === 'all' || product.group === group)
      && (badge === 'all' || product.badge === badge)
      && matchesPrice(product.price)
  })

  const compare = sortComparators[sort]
  if (compare) visibleProducts.sort(compare)
  return visibleProducts
}
