import { pgPromise, db } from '../db'

const putProduct = p =>
  db.one(
    `INSERT INTO product(name, mrp, price, gst)
    VALUES($1, $2, $3, $4)
    RETURNING pid`,
    [p.name, p.mrp, p.price, p.gst]
  )
const getProducts = () => db.manyOrNone('SELECT * FROM product WHERE active = TRUE')
const updateProduct = p => db.oneOrNone(
  `UPDATE product
  SET name = $2, mrp = $3, price = $4, gst = $5
  WHERE pid = $1
  RETURNING pid`,
  [p.pid, p.name, p.mrp, p.price, p.gst]
)
const deleteProduct = id => db.oneOrNone(
  `UPDATE product
  SET active=FALSE
  WHERE pid = $1
  RETURNING pid`,
  [id]
)

export async function getAll() {
  console.log('Find Product Match')

  try {
    const products = await getProducts()
    console.log('Products -> ', products)
    return { success: true, products }
  } catch(error) {
    console.log('Find Product Match Error -> ', error)
    return { error }
  }
}

export async function put(product) {
  console.log('Create Product', product)
  try {
    const created = await putProduct(product)
    console.log('Created Product -> ', created)
    return { success: true }
  } catch(error) {
    console.log('Create Product Error -> ', error)
    return { error }
  }
}

export async function update(product) {
  console.log('Update Product', product)

  try {
    const updated = await updateProduct(product)
    console.log('Updated Product -> ', updated)
    return { success: true }
  } catch(error) {
    console.log('Update Product Error -> ', error)
    return { error }
  }
}

export async function del(productId) {
  console.log('Delete Product', productId)

  try {
    const deleted = await delP(productId)
    console.log('Deleted Product -> ', deleted)
    return { success: true }
  } catch(error) {
    console.log('Delete Product Error -> ', error)
    return { error }
  }
}
