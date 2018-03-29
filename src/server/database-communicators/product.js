import { pgPromise, db } from '../db'

const putProduct = p =>
  db.one(
    `INSERT INTO product(name, hsncode, mrp, price, gst)
    VALUES($1, $2, $3, $4, $5)
    RETURNING pid`,
    [p.name, p.hsncode, p.mrp, p.price, p.gst]
  )
const getProducts = () => db.manyOrNone('SELECT * FROM product WHERE active = TRUE')
const getProduct = productid => db.one('SELECT * FROM product WHERE pid = $1', [productid])
const updateProduct = p => db.oneOrNone(
  `UPDATE product
  SET name = $2, hsncode = $3, mrp = $4, price = $5, gst = $6
  WHERE pid = $1
  RETURNING pid`,
  [p.pid, p.name, p.hsncode, p.mrp, p.price, p.gst]
)
const deleteProduct = id => db.oneOrNone(
  `UPDATE product
  SET active=FALSE
  WHERE pid = $1
  RETURNING pid`,
  [id]
)

export async function get(productId) {
  console.log('Get Product by ID')

  try {
    const product = await getProduct(productId)
    console.log('Products -> ', product)
    return { success: true, product }
  } catch(error) {
    console.log('Find Product Match Error -> ', error)
    return { error }
  }
}


export async function getAll() {
  console.log('Get Product Matches')

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
