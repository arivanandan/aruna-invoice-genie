import { pgPromise, db } from './db'
import converter from 'number-to-words'

import * as invoice from './database-communicators/invoice'
import * as invoiceProduct from './database-communicators/invoice-product'
import * as customer from './database-communicators/customer'
import * as product from './database-communicators/product'
import * as store from './database-communicators/store'

const calculateGst = (productList, igst) => productList.map(
  productRow => {
    const amount = productRow.price * productRow.quantity
    const bprice = productRow.gst === 0
      ? amount
      : ((100 / (100 + productRow.gst)) * amount)
    const gstAmount = amount - bprice
    return igst
      ? {
        ...productRow,
        bprice: bprice.toFixed(2),
        amount: amount.toFixed(2),
        igst: gstAmount.toFixed(2)
      }
      : {
        ...productRow,
        bprice: bprice.toFixed(2),
        amount: amount.toFixed(2),
        cgst: (gstAmount / 2).toFixed(2),
        sgst: (gstAmount / 2).toFixed(2)
      }
  }
)

const calculateTotal = productList => productList.reduce(
  (out, product) => (
    {
      bpriceTotal: out.bpriceTotal + parseFloat(product.bprice),
      cgstTotal: out.cgstTotal + parseFloat(product.cgst),
      sgstTotal: out.sgstTotal + parseFloat(product.sgst),
      igstTotal: out.igstTotal + parseFloat(product.igst),
      total: out.total + parseFloat(product.amount)
    }
  ),
  { bpriceTotal: 0, cgstTotal: 0, sgstTotal: 0, igstTotal: 0, total: 0 }
)

const twoDecimal = obj => Object.keys(obj).reduce((acc, cur) => {
  acc[cur] = typeof obj[cur]  === 'number' ? obj[cur].toFixed(2) : obj[cur]
  return acc;
}, {});

export async function put(req, res, update) {
  console.log('Create invoice')
  console.log(req.query)
  console.log(req.body)

  const input = req.body
  const data = req.body.rows

  const productIdAdder = async row => {
    const productAdderResult = await product.put(row)
    const pid = productAdderResult.pid
    return { ...row, pid }
  }

  const productIdGenerator = async data =>
    await Promise.all(
      data.map(row =>
        row.pid === ''
          ? productIdAdder(row)
          : row
      )
    )

  const columnSet = pgPromise().helpers.ColumnSet(
    ['invoiceid', 'productid', 'price', 'quantity', 'usedgst'],
    { table: 'invoiceproduct' }
  )

  const updateColumnSet = pgPromise().helpers.ColumnSet(
    ['ipid', 'invoiceid', 'productid', 'price', 'quantity', 'usedgst'],
    { table: 'invoiceproduct' }
  )

  const rowDataConstructor = (data, invoiceid, update) =>
    update === true
      ? data.map(row => Object.assign(
          {},
          { ipid: row.ipid, invoiceid, productid: row.pid, price: row.price, quantity: row.quantity, usedgst: row.gst }
        ))
      : data.map(row => Object.assign(
          {},
          { invoiceid, productid: row.pid, price: row.price, quantity: row.quantity, usedgst: row.gst }
        ))

  const invoiceDataInsert = (data, invoiceid) =>
  db.any(
    pgPromise().helpers.insert(
      rowDataConstructor(data, invoiceid), columnSet
    ) + ' RETURNING ipid'
  )

  const invoiceDataUpdate = (data, invoiceid) =>
  db.any(
    pgPromise().helpers.update(
      rowDataConstructor(data, invoiceid, true), updateColumnSet
    ) + ' WHERE v.ipid = t.ipid RETURNING t.ipid'
  )

  try {
    const customer = input.customer.cname === '' && input.customer.cgstid === ''
      ? { cid: null }
      : input.customer.cid !== ''
        ? input.customer
        : await customer.put({ res }, input.customer)
    console.log('Customer Data -> ', customer)

    const date = input.date === "" ? new Date() : input.date

    const { invoice: invoiceData } = (update === true && input.iid)
      ? await invoice.update(date, input.iid, input.igst, customer.cid, 1)
      : await invoice.put(date, input.igst, customer.cid, 1)
    const { iid } = invoiceData
    console.log('Successful invoice insert/update -> ', iid)

    const verifiedData = await productIdGenerator(data)
    console.log('Modified Data', verifiedData)

    const batchRowInsert = update === true
      ?  await invoiceDataUpdate(verifiedData, iid)
      : await invoiceDataInsert(verifiedData, iid)
    console.log('Invoice Products Populated', batchRowInsert)

    res.status(200).json({ iid })
  } catch(e) {
    console.log('Invoice Creation Error -> ', e)
    res.status(500)
  }
}

export async function get(req, res) {
  console.log('Show Invoice')
  console.log(req.params.id)

  try {
    const { error: invoiceGetError, invoice: i } = await invoice.get(req.params.id)
    if (invoiceGetError) throw(invoiceGetError)
    const { iid, dt, igst, storeid, customerid } = i
    console.log('Invoice Get -> ', iid, dt, storeid, customerid)

    const { error: invoiceProductListError, invoiceProducts } = await invoiceProduct.get(iid)
    if (invoiceProductListError) throw(invoiceProductListError)
    console.log('Product List -> ', invoiceProducts)

    const detailedProductList = await Promise.all(
      invoiceProducts.map(async p => {
        const { error: productError, product: productData } = await product.get(p.productid)
        if (productError) throw(productError)
        delete productData.price
        console.log('Product Data -> ', productData)
        return { ...p, ...productData }
      })
    )
    console.log('Super Product List -> ', detailedProductList)

    const productList = calculateGst(detailedProductList, igst)
    console.log('Complete Product List -> ', productList)

    const { store: storeDetails, error: storeGetError } = await store.get(storeid)
    if (storeGetError) throw(storeGetError)
    const { sname, saddress, sgstid } = storeDetails
    console.log('Store Get -> ', sname, saddress, sgstid)

    let cname: null, caddress: null, cgstid: null, customerGetError, customer
    if (customerid) {
      const { customer, error: customerGetError } = await customer.get(customerid)
    }

    const { bpriceTotal, cgstTotal, sgstTotal, igstTotal, total } = twoDecimal(calculateTotal(productList))

    const totalInWords = converter.toWords(total)

    console.log('Total Calculated -> ', total)

    console.log(iid, dt.toString().substring(0, 15), igst,
      sname, saddress, sgstid,
      cname, caddress, cgstid,
      bpriceTotal, cgstTotal, sgstTotal, igstTotal, total, totalInWords,
      productList)
    res.status(200).json({
      iid, dt: dt.toString().substring(0, 15), igst,
      sname, saddress, sgstid,
      cname, caddress, cgstid,
      bpriceTotal, cgstTotal, sgstTotal, igstTotal, total, totalInWords,
      productList
    })

  } catch(e) {
    console.log('Show Invoice Error -> ', e)
    res.status(500)
  }
}

export async function update(req, res) {
  put(req, res, true);
}

export async function del(req, res) {
  const invoiceid = req.params.id
  console.log('Delete Invoice')

  const { success } = await invoice.del(req.params.id)
  return success ? res.status(200) : res.status(500)
}
