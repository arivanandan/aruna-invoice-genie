import { updateState } from 'redux-jetpack'
import server from '../constants'
import 'isomorphic-fetch'

export async function reset() {
  updateState('redirect', () => null)
}
