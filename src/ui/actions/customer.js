import { getState, updateState } from 'redux-jetpack'
import 'isomorphic-fetch'

export async function findMatch(partname) {
  console.log('Find Match -> ')
  const res = await fetch(`http://localhost:9000/api/customer/match/${partname}`)
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
  const customerMatches = getState(state => state.customerMatches)
  const matchRegex = new RegExp(partname, 'i')
  const refinedCustomerMatches = customerMatches.filter(customer => (matchRegex).test(customer.name))
  updateState('refinedCustomerMatches', state => refinedCustomerMatches)
}

export function clearRefinedMatches() {
  updateState('refinedCustomerMatches', refinedCustomerMatches => null)
}
