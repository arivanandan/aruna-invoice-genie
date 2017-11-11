import { updateState } from 'redux-jetpack'

export function checkbox(input) {
  const name = input.target.value.toLowerCase()
  updateState('input', input => ({ ...input, [name]: !input[name] }))
}

export function textbox(input, row) {
  const name = input.target.name
  const value = input.target.value
  updateState('input', input => (
    {
      ...input,
      rows: Object.assign(
        [...input.rows],
        { [row]: { ...input.rows[row], [name]: value } }
      )
    }
  ))
}

export function radio(input, row) {
  const name = input.target.name
  const value = input.target.value
  updateState('input', input => (
    {
      ...input,
      rows: Object.assign(
        [...input.rows],
        { [row]: { ...input.rows[row], [name]: value } }
      )
    }
  ))
}

export function setProduct(row, match) {
  // match = { ...match, gst: match.gst.toString() }
  console.log('Set Product -> ', row, match)
  updateState('input', input => (
    {
      ...input,
      rows: Object.assign(
        [...input.rows],
        { [row]: match }
      )
    }
  ))
}

export function setCustomer(input) {
  const name = input.target.name
  const value = input.target.value
  console.log('Set Customer Address -> ', name, value)
  updateState('input', input => (
    {
      ...input,
      customer: { ...input.customer, cid: "" }
    }))
}

export function setActive(row) {
  updateState('currentActive', currentActive => row)
}

export function newProduct(row) {
  updateState('input', input => ({
    ...input,
    rows: Object.assign(
      [...input.rows],
      { [row]: { ...input.rows[row], pid: "" } }
    )
  }))
}

export function newCustomer(row) {
  updateState('input', input => ({
    ...input,
    rows: Object.assign(
      [...input.rows],
      { [row]: { ...input.rows[row], pid: "" } }
    )
  }))
}

export function addRow() {
  updateState('input', input => (
    {
      ...input,
      rows: Object.assign([...input.rows],
        {
          [input.rows.length]: {
            pid: "",
            name: "",
            mrp: "",
            price: "",
            quantity: "",
            gst: ""
          }
        }
      )
    }
  ))
}
