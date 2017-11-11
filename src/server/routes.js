import { pgPromise, db } from './db'
import converter from 'number-to-words'
require("babel-core/register")
require("babel-polyfill")

export async function createInvoice(req, res) {
  console.log('Create invoice')
  console.log(req.query)
  console.log(req.body)

  const input = req.body
  const data = req.body.rows

  const columnSet = pgPromise().helpers.ColumnSet(
    ['invoiceid', 'productid', 'price', 'quantity'],
    { table: 'invoiceproduct' }
  )

  const customerInsert = c => db.one(`INSERT INTO customer(cname, caddress, cgstid)
    VALUES($1, $2, $3)
    RETURNING cid`,
    [c.cname, c.caddress, c.cgstid]
  )

  const invoiceInsert = (igst, cid) => db.one(`INSERT INTO invoice(dt, igst, storeid, customerid)
    VALUES(current_timestamp, $1, $2, $3)
    RETURNING iid`,
    [igst, 1, cid]
  )

  const invoiceDataInsert = (data, invoiceid) =>
    db.any(
      pgPromise().helpers.insert(
        rowDataConstructor(data, invoiceid), columnSet
      ) + 'RETURNING ipid'
    )

  const rowDataConstructor = (data, invoiceid) =>
    data.map(row => Object.assign(
      {},
      { invoiceid, productid: row.pid, price: row.price, quantity: row.quantity }
    ))

  const productAdder = r =>
    db.one(
      `INSERT INTO product(name, mrp, price, gst)
      VALUES($1, $2, $3, $4)
      RETURNING pid`,
      [r.name, r.mrp, r.price, r.gst]
    )

  const productIdAdder = async row => {
    const productAdderResult = await productAdder(row)
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

  try {
    const customer = input.customer.cname === '' && input.customer.cgstid === ''
      ? { cid: null }
      : input.customer.cid !== ''
        ? input.customer
        : await customerInsert(input.customer)
    console.log('Customer Data -> ', customer)

    const { iid } = await invoiceInsert(input.igst, customer.cid)

    const verifiedData = await productIdGenerator(data)
    console.log('Modified Data', verifiedData)

    const batchRowInsert = await invoiceDataInsert(verifiedData, iid)
    console.log('Invoice Products Populated', batchRowInsert)

    res.status(200).json({ iid })
  } catch(e) {
    console.log('Invoice Creation Error -> ', e)
    res.status(500)
  }

}


export async function showInvoice(req, res) {
  console.log('Show Invoice')
  console.log(req.params.id)

  const invoiceGet = invoiceid => db.one('SELECT * FROM invoice WHERE iid = $1', [invoiceid])
  const customerGet = customerid => db.one('SELECT * FROM customer WHERE cid = $1', [customerid])
  const storeGet = storeid => db.one('SELECT * FROM store WHERE sid = $1', [storeid])
  const invoiceListGet = invoiceid => db.many('SELECT * FROM invoiceproduct WHERE invoiceid = $1', [invoiceid])
  const productGet = productid => db.one('SELECT * FROM product WHERE pid = $1', [productid])
  const calculateGst = (productList, igst) => productList.map(
    productRow => {
      const unitPrice = productRow.gst === 0
        ? productRow.price
        : ((100 / (100 + productRow.gst)) * productRow.price)
      const bprice = +(unitPrice * productRow.quantity).toFixed(2)
      const amount = productRow.price * productRow.quantity
      const gstAmount = +(amount - bprice).toFixed(2)
      return igst
        ? { ...productRow, bprice, amount, igst: gstAmount }
        : { ...productRow, bprice, amount, cgst: gstAmount / 2, sgst: gstAmount / 2 }
    }
  )
  const calculateTotal = productList => productList.reduce(
    (out, product) => (
      {
        bpriceTotal: out.bpriceTotal + product.bprice,
        cgstTotal: out.cgstTotal + product.cgst,
        sgstTotal: out.sgstTotal + product.sgst,
        igstTotal: out.igstTotal + product.igst,
        total: out.total + product.amount
      }
    ),
    { bpriceTotal: 0, cgstTotal: 0, sgstTotal: 0, igstTotal: 0, total: 0 }
  )

  try {
    const { iid, dt, igst, storeid, customerid } = await invoiceGet(req.params.id)
    console.log('Invoice Get -> ', iid, dt, storeid, customerid)

    const plainProductList = await invoiceListGet(iid)
    console.log('Product List -> ', plainProductList)

    const detailedProductList = await Promise.all(
      plainProductList.map(async p => {
        const productData = await productGet(p.productid)
        delete productData.price
        console.log('Product Data -> ', productData)
        return { ...p, ...productData }
      })
    )
    console.log('Super Product List -> ', detailedProductList)

    const productList = calculateGst(detailedProductList, igst)
    console.log('Complete Product List -> ', productList)

    const { sname, saddress, sgstid } = await storeGet(storeid)
    console.log('Store Get -> ', sname, saddress, sgstid)

    const { cname, caddress, cgstid } = customerid ? await customerGet(customerid) : { cname: null, caddress: null, cgstid: null }

    const { bpriceTotal, cgstTotal, sgstTotal, igstTotal, total } = calculateTotal(productList)

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

export async function getProducts(req, res) {
  console.log('Find Product Match')

  const productGet = productid => db.manyOrNone('SELECT * FROM product')

  try {
    const productMatches = await productGet()
    console.log('Product Matches -> ', productMatches)
    res.status(200).json({ productMatches })
  } catch(e) {
    console.log('Find Product Match Error -> ', e)
    res.status(500)
  }
}

export async function getCustomers(req, res) {
  console.log('Find Customer Match')

  const caddressGet = productid => db.manyOrNone('SELECT * FROM customer')

  try {
    const customerMatches = await caddressGet()
    console.log('Customer Address Matches -> ', customerMatches)
    res.status(200).json({ customerMatches })
  } catch(e) {
    console.log('Find Customer Match Error -> ', e)
    res.status(500)
  }
}
