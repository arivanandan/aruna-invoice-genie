import { pgPromise, db } from './db'
import converter from 'number-to-words'
require("babel-core/register")
require("babel-polyfill")

export async function get(req, res) {
  console.log(req.params.from)
  console.log(req.params.to)

  const getInvoice = (from, to) => db.manyOrNone(`SELECT * FROM invoice
    WHERE dt
    BETWEEN $1::date
    AND $2::date + '1 day'::interval`,
    [from, to])

  const getCustomer = cid => db.oneOrNone('SELECT cgstid FROM customer WHERE cid = $1', [cid])

  const getInvoiceProducts = invoiceid => db.manyOrNone(`SELECT *
    FROM invoiceproduct
    WHERE invoiceid = $1`, [invoiceid])

  const calculateCategorizeGST = invoiceProducts =>
    invoiceProducts.reduce(
      (acc, ip) => {
        const total = ip.price * ip.quantity
        const baseAmount = ip.usedgst === 0
          ? total
          : ((100 / (100 + ip.usedgst)) * total)
        const gst = total - baseAmount + acc[ip.usedgst].gst
        const amount = baseAmount + acc[ip.usedgst].amount
        return { ...acc, [ip.usedgst]: { gst, amount } }
      },
      {
        0: { gst: 0, amount: 0 },
        5: { gst: 0, amount: 0 },
        12: { gst: 0, amount: 0 },
        18: { gst: 0, amount: 0 },
        28: { gst: 0, amount: 0 }
      }
    )

  const removeEmpty = obj => Object.keys(obj).reduce(
    (acc, cur) => obj[cur].amount
      ? { ...acc, [cur]: {
        gst: obj[cur].gst,
        amount: obj[cur].amount.toFixed(2)
      } }
      : acc
    , {}
  )

  try {
    const invoices = await getInvoice(req.params.from, req.params.to)
    const output = await Promise.all(
      invoices.map(async invoice => {
        const customer = await getCustomer(invoice.customerid)
        const invoiceProducts = await getInvoiceProducts(invoice.iid)
        const outputInvoiceProducts = calculateCategorizeGST(invoiceProducts)
        const gst = removeEmpty(outputInvoiceProducts)
        return {
          ...invoice,
          cgstid: customer.cgstid,
          dt: invoice.dt.toLocaleString().substring(0, 10).split('-').reverse().join('-'),
          gst
        }
      })
    )
    res.status(200).json(output)
  } catch(e) {
    console.log('Unable to generate report -> ', e)
    res.status(500)
  }
}
