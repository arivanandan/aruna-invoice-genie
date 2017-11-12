export default {
  redirect: null,
  highlightProductMatch: null,
  productMatches: [],
  refinedProductMatches: [],
  customerMatches: [],
  refinedCustomerMatches: [],
  currentActive: "",
  input: {
    igst: false,
    customer: {
      cid: "",
      cname: "",
      caddress: "",
      cgstid: ""
    },
    rows: [
      {
        pid: "",
        name: "",
        mrp: "",
        price: "",
        quantity: "",
        gst: ""
      }
    ]
  },
  invoice: {}
};
