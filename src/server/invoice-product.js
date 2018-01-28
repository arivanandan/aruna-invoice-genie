import { pgPromise, db } from './db'

import * as invoiceProduct from './database-communicators/invoice-product'

export async function get(iid) {
  console.log('Find Product Match')

  return await invoiceProduct.get(iid)
}

export async function put(data, invoiceid) {
  console.log('Insert Invoice Products')
  console.log(inoviceid, data)

  const rowDataConstructor = (data, invoiceid) =>
    data.map(row => Object.assign(
      {},
      {
        invoiceid,
        productid: row.pid,
        price: row.price,
        quantity: row.quantity,
        usedgst: row.gst
      }
    ))

  const columnSet = pgPromise().helpers.ColumnSet(
    ['invoiceid', 'productid', 'price', 'quantity', 'usedgst'],
    { table: 'invoiceproduct' }
  )

  return await invoiceProduct.put(req.body)
}
