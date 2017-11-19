import { updateState } from 'redux-jetpack'

export async function get(from, to) {
  console.log('Get Report for -> ', from, to)
  const res = await fetch(`http://192.168.1.4:9000/api/report/${from}/${to}`)
  let rows
  if (res.status === 200) {
    rows = await res.json()
    console.log('Report Rows -> ', rows)
    updateState('report', report => ({
      ...report,
      rows
    }))
  } else console.log('No data found')
}
