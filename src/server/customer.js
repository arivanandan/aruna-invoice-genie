import * as customer from './database-communicators/customer'

export async function get(req, res) {
  console.log('Get Customers')

  const out =  customer.get(productId).success
  return out.success ?  out.customers : res.status(500)
}
