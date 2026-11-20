export function getProductFormValues(product) {
  return {
    name: product?.name ?? '',
    price: product ? String(product.price) : '',
    image: product?.image ?? '',
    group: product?.group ?? 'new',
    badge: product?.badge ?? '',
    featured: product?.featured ?? false,
    description: product?.description ?? '',
    category: product?.category ?? '',
    tags: product?.tags ?? '',
    availability: product?.availability ?? '',
  }
}

export function getProductFormData(values) {
  const data = { ...values }
  for (const field of ['price']) {
    if (String(values[field]).trim() === '') throw new Error('Completa el precio del producto.')
    data[field] = Number(values[field])
  }
  return data
}
