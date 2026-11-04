
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001'

export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/api/v1/products`)

  if (!response.ok) {
    throw new Error('Unable to fetch products')
  }

  return response.json()
}

export async function createProduct(product) {
  const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  })

  if (!response.ok) {
    throw new Error('Unable to create product')
  }

  return response.json()
}

export async function updateProduct(id, product) {
  const response = await fetch(`${API_BASE_URL}/api/v1/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  })

  if (!response.ok) {
    throw new Error('Unable to update product')
  }

  return response.json()
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_BASE_URL}/api/v1/products/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Unable to delete product')
  }

  return response.json()
}


export async function getDashboardSummary() {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/dashboard/summary`
  )

  if (!response.ok) {
    throw new Error('Unable to fetch dashboard analytics')
  }

  return response.json()
}


export async function getBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/health`)

  if (!response.ok) {
    throw new Error('Backend health check failed')
  }

  return response.json()
}

export async function getAppVersion() {
  const response = await fetch(`${API_BASE_URL}/version`)

  if (!response.ok) {
    throw new Error('Unable to fetch application version')
  }

  return response.json()
}
