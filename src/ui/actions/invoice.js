import { updateState } from 'redux-jetpack'
import 'isomorphic-fetch'

export async function create(data) {
  console.log("Create invoice action data", data)
  const options = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
  }
  const res = await fetch(`http://aruna.herokuapp.com/api/invoice/create`, options)
  console.log('Create Invoice Action Result -> ', res)
  res.status === 200
    ? res.json().then(
      resData => updateState('redirect', redirect => `/invoice/${resData.iid}`)
    )
    : updateState('redirect', redirect => '/invoice/no-data/')
}

export async function display(id) {
  console.log('Display invoice ', id)
  const res = await fetch(`http://aruna.herokuapp.com/api/invoice/${id}`)
  console.log('Display Invoice Action Result -> ', res)
  if (res.status === 200)
    res.json().then(
      resData => updateState('invoice', invoice => resData)
    )
  else console.log('No data found')
}
