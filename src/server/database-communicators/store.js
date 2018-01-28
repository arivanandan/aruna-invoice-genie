import { pgPromise, db } from '../db'

const storeGet = storeid => db.one('SELECT * FROM store WHERE sid = $1', [storeid])

export async function get(storeid) {
  console.log('Get Customers')

  try {
    const store = await storeGet(storeid)
    console.log('Store  -> ', store)
    return { success: true, store }
  } catch(e) {
    console.log('Get Store Error -> ', e)
    return { error }
  }
}
