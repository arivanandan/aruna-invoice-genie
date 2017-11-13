import { getState, updateState } from 'redux-jetpack'
import 'isomorphic-fetch'

export async function get() {
  console.log('Get Products -> ')
  const res = await fetch(`http://localhost:9000/api/product`)
  let resData
  if (res.status === 200) {
    resData = await res.json()
    updateState('products', products => resData.products)
  } else console.log('No data found')
}

export function findMatches(partname) {
  const products = getState(state => state.products)
  const matchRegex = new RegExp(partname, 'i')
  const productMatches = products.filter(product => (matchRegex).test(product.name))
  updateState('productMatches', state => productMatches)
}

export function clearMatches() {
  updateState('productMatches', productMatches => null)
}

export async function create(data) {
  console.log('Create Product Server Call Action -> ', data)
  const options = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
  }
  const res = await fetch(`http://localhost:9000/api/product/create`, options)
  const activeModal = res.status === 200 ? 'create-success' : 'create-failure'
  updateState('productManage', productManage =>
  ({
    ...productManage,
    activeModal
  }))
}

export async function update(data) {
  console.log('Update Product Server Call Action -> ', data)
  const options = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
  }
  const res = await fetch(`http://localhost:9000/api/product/update`, options)
  const activeModal = res.status === 200 ? "update-success" : "update-failure"
  updateState('productManage', productManage =>
  ({
    ...productManage,
    activeModal
  }))
}

export async function remove(pid) {
  const res = await fetch(`http://localhost:9000/api/product/delete/${pid}`)
  const activeModal = res.status === 200 ? "delete-success" : "delete-failure"
  updateState('productManage', productManage =>
  ({
    ...productManage,
    activeModal
  }))
}
