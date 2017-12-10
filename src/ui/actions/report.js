import { updateState } from 'redux-jetpack'

const calculateTotals = data => {
  // console.log(data)
  return data.reduce((outerAcc, dataRow) => {
    const { gst, igst, total } = Object.keys(dataRow.gst).reduce((acc, key) => {
      key = parseInt(key)
      // console.log(dataRow, key)
      // console.log('gst', acc.gst, dataRow.gst[key].gst)
      // console.log('total', acc.total, dataRow.gst[key].total)
      const gst = !dataRow.igst ? dataRow.gst[key].gst + acc.gst : acc.gst
      const igst = dataRow.igst ? dataRow.gst[key].gst + acc.igst : acc.igst
      const total = dataRow.gst[key].total + acc.total
      return { gst, igst, total }
    }, { gst: 0, igst: 0, total: 0 })
    // console.log('INNER REDUCE OUT -> ', gst, igst, total)
    return { gst: gst + outerAcc.gst, igst: igst + outerAcc.igst, total: total + outerAcc.total }
  }, { gst: 0, igst: 0, total: 0 })
}

export async function get(from, to) {
  console.log('Get Report for -> ', from, to)
  // from='2017-11-01'
  // to='2017-12-01'
  const res = await fetch(`http://localhost:9000/api/report/${from}/${to}`)
  const out = { rows: [], total: 0 }
  if (res.status === 200) {
    out.rows = await res.json()
    out.total = calculateTotals(out.rows)
    console.log('Report Rows -> ', out.rows, out.total)
    updateState('report', report => ({
      ...report,
      out
    }))
  } else console.log('No data found')
}
