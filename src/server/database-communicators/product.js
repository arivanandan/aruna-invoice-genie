import { pgPromise, db } from '../db'
// require("babel-core/register")
// require("babel-polyfill")

export async function getAll() {
  console.log('Find Product Match')

  const productGetAll = () => db.manyOrNone('SELECT * FROM product WHERE active = TRUE')

  try {
    const products = await productGetAll()
    console.log('Products -> ', products)
    return { success: true, products }
  } catch(error) {
    console.log('Find Product Match Error -> ', error)
    return { error }
  }
}

export async function put(product) {
  console.log('Create Product', product)

  const addP = p =>
    db.one(
      `INSERT INTO product(name, mrp, price, gst)
      VALUES($1, $2, $3, $4)
      RETURNING pid`,
      [p.name, p.mrp, p.price, p.gst]
    )

  try {
    const created = await addP(product)
    console.log('Created Product -> ', created)
    return { success: true }
  } catch(error) {
    console.log('Create Product Error -> ', error)
    return { error }
  }
}

export async function update(product) {
  console.log('Update Product', product)

  const upP = p => db.oneOrNone(`
    UPDATE product
    SET name = $2, mrp = $3, price = $4, gst = $5
    WHERE pid = $1
    RETURNING pid`,
    [p.pid, p.name, p.mrp, p.price, p.gst])

  try {
    const updated = await upP(product)
    console.log('Updated Product -> ', updated)
    return { success: true }
  } catch(error) {
    console.log('Update Product Error -> ', error)
    return { error }
  }
}

export async function remove(productId) {
  console.log('Delete Product', productId)

  const delP = id => db.oneOrNone(`
    UPDATE product
    SET active=FALSE
    WHERE pid = $1
    RETURNING pid`,
    [id])

  try {
    const deleted = await delP(productId)
    console.log('Deleted Product -> ', deleted)
    return { success: true }
  } catch(error) {
    console.log('Delete Product Error -> ', error)
    return { error }
  }
}
