import React, { Component } from "react";
import { connect } from "redux-jetpack";
import * as invoice from "../../actions/invoice";

class Display extends Component {
  componentWillMount() {
    invoice.display(this.props.match.params.id);
  }

  camelize(sentence) {
    return sentence
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.substring(1))
      .join(" ");
  }

  render() {
    return this.props.invoice ? (
      <div className="invoiceContainer">
        <h2>Invoice</h2>
        <div className="invoiceHeader">
          <div id="sname">{this.props.invoice.sname}</div>
          <div>
            <div>Invoice: #{this.props.invoice.iid}</div>
            <div>Date: {this.props.invoice.dt}</div>
          </div>
        </div>
        <div className="addressBlock">
          <div className="shopAddress">
            {this.props.invoice.saddress &&
              this.props.invoice.saddress
                .split(",")
                .map(addressLine => <div>{addressLine}</div>)}
            <div>{this.props.invoice.sgstid}</div>
          </div>
          <div className="customerAddress">
            {this.props.invoice.cname && <div>{this.props.invoice.cname}</div>}
            {this.props.invoice.caddress && (
              <div>
                {this.props.invoice.caddress &&
                  this.props.invoice.caddress
                    .split(",")
                    .map(addressLine => <div>{addressLine}</div>)}
              </div>
            )}
            {this.props.invoice.cgstid && (
              <div>{this.props.invoice.cgstid}</div>
            )}
          </div>
        </div>
        <div className="productList">
          {this.props.invoice.productList && (
            <div className="productListHeaders">
              <div className="pr-product">
                <b>Product</b>
              </div>
              <div className="pr-mrp">
                <b>MRP</b>
              </div>
              <div className="pr-price">
                <b>Unit Price</b>
              </div>
              <div className="pr-quantity">
                <b>Quantity</b>
              </div>
              <div className="pr-bprice">
                <b>Base Price</b>
              </div>
              <div className="pr-tax">
                <b>Tax Rate</b>
              </div>
              {this.props.invoice.igst ? (
                <div className="pr-gst">
                  <b>IGST</b>
                </div>
              ) : (
                <div className="pr-gst">
                  <div className="pr-cgst">
                    <b>CGST</b>
                  </div>
                  <div className="pr-sgst">
                    <b>SGST</b>
                  </div>
                </div>
              )}
              <div className="pr-amount">
                <b>Amount</b>
              </div>
            </div>
          )}
          {this.props.invoice.productList &&
            this.props.invoice.productList.map(row => (
              <div className="productListRow">
                <div className="pr-product">{row.name}</div>
                <div className="pr-mrp">{row.mrp}</div>
                <div className="pr-price">{row.price}</div>
                <div className="pr-quantity">{row.quantity}</div>
                <div className="pr-bprice">{row.bprice}</div>
                <div className="pr-tax">{row.gst}</div>
                {this.props.invoice.igst ? (
                  <div className="pr-gst">{row.igst}</div>
                ) : (
                  <div className="pr-gst">
                    <div className="pr-cgst">{row.cgst}</div>
                    <div className="pr-sgst">{row.sgst}</div>
                  </div>
                )}
                <div className="pr-amount">{row.amount}</div>
              </div>
            ))}
          {this.props.invoice.total && (
            <div className="summary">
              <div className="invoiceTotalRow">
                <div className="summary-empty" />
                <div className="summary-empty" />
                <div className="summary-empty" />
                <div className="summary-empty" />
                <div className="summary-empty" />
                <div className="summary-empty" />
                <div className="summary-empty" />
                <div className="summary-bprice">
                  {this.props.invoice.bpriceTotal}
                </div>
                <div className="summary-empty" />
                {this.props.invoice.igst ? (
                  <div className="summary-gst">
                    {this.props.invoice.igstTotal}
                  </div>
                ) : (
                  <div className="summary-gst">
                    <div className="summary-cgst">
                      {this.props.invoice.cgstTotal}
                    </div>
                    <div className="summary-sgst">
                      {this.props.invoice.sgstTotal}
                    </div>
                  </div>
                )}
                <div className="summary-total">{this.props.invoice.total}</div>
              </div>
              <div className="summary-totalWords">
                <div>{this.camelize(this.props.invoice.totalInWords)} only</div>
              </div>
            </div>
          )}
        </div>
      </div>
    ) : (
      <div>Loading Data!</div>
    );
  }
}

export default connect(Display, state => state);
