import { pgPromise, db } from '../db'

const customerGet = productid => db.manyOrNone('SELECT * FROM customer')
const customerPut = c => db.one(`INSERT INTO customer(cname, caddress, cgstid)
  VALUES($1, $2, $3)
  RETURNING cid`,
  [c.cname, c.caddress, c.cgstid]
)

export async function get(customerid) {
  console.log('Get Customers')

  try {
    const customers = await customerGet(customerid)
    console.log('Customers  -> ', customers)
    return { success: true, customers }
  } catch(e) {
    console.log('Get Customers Error -> ', e)
    return { error }
  }
}


export async function put(c) {
  try {
    const cid = await customerPut(c)
    console.log('New customer  -> ', cid)
    return { success: true, cid }
  } catch(error) {
    console.log('Put Customers Error -> ', error)
    return { error }
  }
}
