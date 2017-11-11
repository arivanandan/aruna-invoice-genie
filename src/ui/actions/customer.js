import { getState, updateState } from 'redux-jetpack'
import 'isomorphic-fetch'

export async function get() {
  console.log('Find Match -> ')
  const res = await fetch(`http://localhost:9000/api/customer/match`)
  if (res.status === 200)
    res.json().then(
      resData => {
        updateState('customerMatches', customerMatches => resData.customerMatches)
        updateState('refinedCustomerMatches', refinedCustomerMatches => resData.customerMatches)
      }
    )
  else console.log('No data found')
}

export function refineMatches(partname) {
  console.log('Refine Customer Match -> ', partname)
  const customerMatches = getState(state => state.customerMatches)
  const matchRegex = new RegExp(partname, 'i')
  const refinedCustomerMatches = customerMatches.filter(customer => (matchRegex).test(customer.cname))
  console.log('Refined Customer Matches -> ', refinedCustomerMatches)
  updateState('refinedCustomerMatches', state => refinedCustomerMatches)
}

export function clearRefinedMatches() {
  updateState('refinedCustomerMatches', refinedCustomerMatches => null)
}
