export function getProductFormValues(product) {
  return {
    name: product?.name ?? '',
    price: product ? String(product.price) : '',
    image: product?.image ?? '',
    group: product?.group ?? 'new',
    badge: product?.badge ?? '',
    rating: String(product?.rating ?? 0),
    featured: product?.featured ?? false,
    description: product?.description ?? '',
    category: product?.category ?? '',
    tags: product?.tags ?? '',
    availability: product?.availability ?? '',
    reviewCount: String(product?.reviewCount ?? 0),
  }
}

export function getProductFormData(values) {
  const data = { ...values }
  for (const field of ['price', 'rating', 'reviewCount']) {
    if (String(values[field]).trim() === '') throw new Error('Completa el precio, la valoración y la cantidad de reseñas.')
    data[field] = Number(values[field])
  }
  return data
}
