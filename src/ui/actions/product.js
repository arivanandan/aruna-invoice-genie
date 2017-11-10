import { getState, updateState } from 'redux-jetpack'
import 'isomorphic-fetch'

export async function findMatch(partname) {
  console.log('Find Match -> ')
  const res = await fetch(`http://aruna.herokuapp.com/api/product/match/${partname}`)
  if (res.status === 200)
    res.json().then(
      resData => {
        updateState('productMatches', productMatches => resData.productMatches)
        updateState('refinedProductMatches', refinedProductMatches => resData.productMatches)
      }
    )
  else console.log('No data found')
}

export function refineMatches(partname) {
  const productMatches = getState(state => state.productMatches)
  const matchRegex = new RegExp(partname, 'i')
  const refinedProductMatches = productMatches.filter(product => (matchRegex).test(product.name))
  updateState('refinedProductMatches', currentRefinedProductMatches => refinedProductMatches)
}

export function clearRefinedMatches() {
  updateState('refinedProductMatches', refinedProductMatches => null)
}
