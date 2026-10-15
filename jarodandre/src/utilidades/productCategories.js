export function getProductCategoryKey(product) {
  const category = (product.category ?? '').trim()
  if (category === '') return 'uncategorized'

  const normalizedCategory = category.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('es')
  return `category:${normalizedCategory}`
}

export function getProductCategories(products) {
  const categories = []
  for (const product of products) {
    const value = getProductCategoryKey(product)
    const category = categories.find((item) => item.value === value)

    if (category) {
      category.count += 1
    } else {
      categories.push({ value, label: product.category?.trim() || 'Sin categoría', count: 1 })
    }
  }
  categories.sort((first, second) => first.label.localeCompare(second.label, 'es'))
  return categories
}
