import { apiEndpoint } from '../config'
import { Product } from '../types/Product'
import { CreateProductRequest } from '../types/CreateProductRequest';
import Axios from 'axios'
import { UpdateproductRequest } from '../types/UpdateproductRequest';

export async function getProducts(idToken: string): Promise<Product[]> {
  console.log('Fetching product')

  const response = await Axios.get(`${apiEndpoint}/products`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('products:', response.data)
  return response.data.items
}

export async function createProduct(
  idToken: string,
  products: CreateProductRequest
): Promise<Product> {
  const response = await Axios.post(`${apiEndpoint}/products`,  JSON.stringify(products), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  console.log('product created:', response.data)
  //return productslist.data.item

  console.log('Fetching product')

  const responseNew = await Axios.get(`${apiEndpoint}/products`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('products:', responseNew.data)
  return responseNew.data.items

}

export async function patchProduct(
  idToken: string,
  productId: string,
  updateProduct: UpdateproductRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/products/${productId}`, JSON.stringify(updateProduct), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteProduct(
  idToken: string,
  productId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/products/${productId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  productId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/products/${productId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
