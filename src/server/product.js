import { pgPromise, db } from './db'

import * as product from './database-communicators/product'

export async function getAll(req, res) {
  console.log('Find Product Match')

  const { success, products } = await product.getAll()
  return success ? res.status(200).json({ products }) : res.status(500)
}

export async function put(req, res) {
  console.log('Create Product')
  console.log(req.body)

  const { success } = await product.put(req.body)
  return success ? res.status(200) : res.status(500)
}

export async function update(req, res) {
  console.log('Update Product')
  console.log(req.body)

  const { success } = await product.update(req.body)
  return success ? res.status(200) : res.status(500)
}

export async function remove(req, res) {
  console.log('Delete Product')

  const { success } = await product.remove(req.params.id)
  return success ? res.status(200) : res.status(500)
}
