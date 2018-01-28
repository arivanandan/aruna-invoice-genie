import { pgPromise, db } from '../db'

const invoiceProductsGet = invoiceid => db.many(
  'SELECT * FROM invoiceproduct WHERE invoiceid = $1',
  [invoiceid]
)
const invoiceProductsPut = data => db.any(
  pgPromise().helpers.insert(data, columnSet) + 'RETURNING ipid'
)

export async function get(invoiceId) {
  try {
    const invoiceProducts = await invoiceProductsGet(invoiceId)
    console.log('Invoice  -> ', invoiceProducts)
    return { success: true, invoiceProducts }
  } catch(e) {
    console.log('Get Invoice Error -> ', e)
    return { error }
  }
}

export async function put(p) {
  try {
    const invoiceProducts = await invoiceProductsPut(data)
    console.log('Invoice Product Put  -> ', invoiceProducts)
    return { success: true, invoiceProducts }
  } catch(error) {
    console.log('Put Invoice Products Error -> ', error)
    return { error }
  }
}
