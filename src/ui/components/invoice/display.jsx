import React, { Component } from "react";
import { connect } from "redux-jetpack";
import * as invoice from "../../actions/invoice";

class Display extends Component {
  componentWillMount() {
    invoice.display(this.props.match.params.id);
  }

  render() {
    return this.props.invoice ? (
      <div className="invoiceContainer">
        <h2>Invoice</h2>
        <div className="invoiceHeader">
          <div>Invoice: #{this.props.invoice.iid}</div>
          <div>Date: {this.props.invoice.dt}</div>
        </div>
        <div className="addressBlock">
          <div className="shopAddress">
            <div>{this.props.invoice.sname}</div>
            <div>
              {this.props.invoice.saddress &&
                this.props.invoice.saddress
                  .split(",")
                  .map(addressLine => <div>{addressLine}</div>)}
            </div>
            <div>{this.props.invoice.sgstid}</div>
          </div>
          <div className="customerAddress">
            {this.props.invoice.cname && <div>{this.props.invoice.cname}</div>}
            {this.props.invoice.caddress && (
              <div>{this.props.invoice.caddress &&
                this.props.invoice.caddress
                  .split(",")
                  .map(addressLine => <div>{addressLine}</div>)}</div>
            )}
            {this.props.invoice.cgstid && (
              <div>{this.props.invoice.cgstid}</div>
            )}
          </div>
        </div>
        <div className="productList">
          {this.props.invoice.productList && (
            <div className="productListHeaders">
              <div><b>Product</b></div>
              <div><b>MRP</b></div>
              <div><b>Unit Price</b></div>
              <div><b>Quantity</b></div>
              <div><b>Base Price</b></div>
              <div><b>Tax Rate</b></div>
              {this.props.invoice.igst ? (
                <div><b>IGST</b></div>
              ) : (
                <div>
                  <div><b>CGST</b></div>
                  <div><b>SGST</b></div>
                </div>
              )}
              <div><b>Amount</b></div>
            </div>
          )}
          {this.props.invoice.productList &&
            this.props.invoice.productList.map(row => (
              <div className="productListRow">
                <div>{row.name}</div>
                <div>{row.mrp}</div>
                <div>{row.price}</div>
                <div>{row.quantity}</div>
                <div>{row.bprice}</div>
                <div>{row.gst}</div>
                {this.props.invoice.igst ? (
                  <div>{row.igst}</div>
                ) : (
                  <div>
                    <div>{row.cgst}</div>
                    <div>{row.sgst}</div>
                  </div>
                )}
                <div>{row.amount}</div>
              </div>
            ))}
        </div>
      </div>
    ) : (
      <div>Loading Data!</div>
    );
  }
}

export default connect(Display, state => state);
