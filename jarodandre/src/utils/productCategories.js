export function getProductCategoryKey(product) {
  const category = (product.category ?? '').trim()
  return category
    ? `category:${category.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('es')}`
    : 'uncategorized'
}

export function getProductCategories(products) {
  const categories = new Map()
  for (const product of products) {
    const value = getProductCategoryKey(product)
    if (!categories.has(value)) {
      categories.set(value, { value, label: product.category?.trim() || 'Sin categoría', count: 0 })
    }
    categories.get(value).count += 1
  }
  return [...categories.values()].sort((first, second) => first.label.localeCompare(second.label, 'es'))
}
