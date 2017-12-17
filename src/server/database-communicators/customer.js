import { pgPromise, db } from '../db'
// require("babel-core/register")
// require("babel-polyfill")

export async function get(productid) {
  console.log('Get Customers')

  const cGet = productid => db.manyOrNone('SELECT * FROM customer')

  try {
    const customers = await cGet(productid)
    console.log('Customers  -> ', customers)
    return { success: true, customers }
  } catch(e) {
    console.log('Get Customers Error -> ', e)
    return { error }
  }
}


export async function put(c) {
  const cPut = db.one(`INSERT INTO customer(cname, caddress, cgstid)
    VALUES($1, $2, $3)
    RETURNING cid`,
    [c.cname, c.caddress, c.cgstid]
  )

  try {
    const cid = await cPut(c)
    console.log('New customer  -> ', cid)
    return { success: true, cid }
  } catch(error) {
    console.log('Put Customers Error -> ', error)
    return { error }
  }
}
