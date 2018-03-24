import { pgPromise, db } from './db'

import * as invoiceProduct from './database-communicators/invoice-product'

export async function get(iid) {
  console.log('Find Product Match')

  return await invoiceProduct.get(iid)
}

export async function put(data, invoiceid) {
  console.log('Insert Invoice Products')
  console.log(inoviceid, data)

  return await invoiceProduct.put(req.body)
}
