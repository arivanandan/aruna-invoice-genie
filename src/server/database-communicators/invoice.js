import { pgPromise, db } from '../db'

const invoiceGet = invoiceid => db.one('SELECT * FROM invoice WHERE iid = $1', [invoiceid])
const invoicePut = (date, igst, storeid = 1, cid) => db.one(`INSERT INTO invoice(dt, igst, storeid, customerid)
  VALUES($1, $2, $3, $4)
  RETURNING iid`,
  [date, igst, storeid, cid]
)
const invoiceDel = invoiceid => db.one('DELETE FROM invoice WHERE iid = $1', [invoiceid])

export async function get(invoiceId) {
  try {
    const invoice = await invoiceGet(invoiceId)
    console.log('Invoice  -> ', invoice)
    return { success: true, invoice }
  } catch(e) {
    console.log('Get Invoice Error -> ', e)
    return { error }
  }
}


export async function put(date, igst, cid, storeid) {
  try {
    const invoice = await invoicePut(date, igst, storeid, cid)
    console.log('New Invoice  -> ', invoice)
    return { success: true, invoice }
  } catch(error) {
    console.log('Put Invoice Error -> ', error)
    return { error }
  }
}

export async function del(invoiceid) {
  try {
    const invoice = await invoiceDel(invoiceid)
    console.log('Delete Invoice  -> ', invoice)
    return { success: true, invoice }
  } catch(error) {
    console.log('Delete Invoice Error -> ', error)
    return { error }
  }
}