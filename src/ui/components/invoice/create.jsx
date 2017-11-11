import React, { Component } from "react";
import { Redirect } from "react-router";
import { connect } from "redux-jetpack";
import * as trackInput from "../../actions/input-track";
import * as invoice from "../../actions/invoice";
import * as product from "../../actions/product";
import * as customer from "../../actions/customer";

class Create extends Component {
  constructor() {
    super();
    this.create = this.create.bind(this);
  }

  componentWillMount() {
    product.get();
  }

  findProduct(row, pid) {
    return function(e) {
      trackInput.setActive(row);
      if (pid) trackInput.newProduct(row);
      if (e.target.value.length > 2) product.refineMatches(e.target.value);
      trackInput.textbox(e, row);
    };
  }

  findCustomer(cid) {
    return function(e) {
      if (cid) trackInput.newCustomer();
      if (e.target.value.length === 2) customer.findMatch(e.target.value);
      if (e.target.value.length > 2) customer.refineMatches(e.target.value);
      trackInput.customerData(e);
    };
  }

  trackInput(row, type) {
    return function(e) {
      if (type === "textbox") return trackInput.textbox(e, row);
      return trackInput.radio(e, row);
    };
  }

  selectProduct(row, match) {
    trackInput.setProduct(row, match);
    product.clearRefinedMatches();
  }

  selectCustomer(row, match) {
    trackInput.setCustomer(row, match);
    customer.clearRefinedMatches();
  }

  create() {
    const status = invoice.create(this.props.input);
  }

  render() {
    return (
      <div className="createContainer">
        <h2>Aruna Invoice Genie</h2>
        <div>
          <input
            type="checkbox"
            value="IGST"
            placeholder="Product"
            checked={this.props.input.igst}
            onChange={trackInput.checkbox}
          />
          IGST
        </div>
        <div className="customerAddress">
          <div className="nameId">
            <input
              type="text"
              name="cname"
              placeholder="Customer Name"
              value={this.props.input.cname}
              onChange={trackInput.setCustomerAddress}
            />
            <input
              type="text"
              name="cgstid"
              placeholder="Customer GSTID"
              value={this.props.input.cgstid}
              onChange={trackInput.setCustomerAddress}
            />
          </div>
          <div className="address">
            <input
              type="text"
              name="caddress"
              placeholder="Customer Address"
              value={this.props.input.caddress}
              onChange={trackInput.setCustomerAddress}
            />
          </div>
          <div>
            {this.props.refinedCustomerMatches &&
              this.props.refinedCustomerMatches.map(match => (
                <div
                  className="matchRow"
                  onClick={() => this.selectCustomer(row, match)}
                >
                  <div>{match.name}</div>
                  <div>{match.address}</div>
                </div>
              ))}
          </div>
        </div>
        <div className="createToolkit">
          <div>
            <input
              type="button"
              value="+"
              name="addRow"
              onClick={trackInput.addRow}
            />
          </div>
          <div>
            <input
              type="button"
              name="submit"
              value="Create Invoice"
              onClick={this.create}
            />
          </div>
        </div>
        {
          <div className="inputHeaders">
            <div>Product Name</div>
            <div>MRP</div>
            <div>Selling Price</div>
            <div>Quantity</div>
            <div>GST</div>
          </div>
        }
        {[...Array(this.props.input.rows.length).keys()].map(row => (
          <div key={row}>
            <div className="inputRow">
              <input
                type="text"
                name="name"
                data-row={row}
                placeholder="Product"
                value={this.props.input.rows[row].name}
                onChange={this.findProduct(row, this.props.input.rows[row].pid)}
              />
              <input
                type="text"
                name="mrp"
                data-row={row}
                placeholder="MRP"
                value={this.props.input.rows[row].mrp}
                disabled={this.props.input.rows[row].pid === "" ? false : true}
                onChange={this.trackInput(row, "textbox")}
              />
              <input
                type="text"
                name="price"
                data-row={row}
                placeholder="Selling Price"
                value={this.props.input.rows[row].price}
                onChange={this.trackInput(row, "textbox")}
              />
              <input
                type="text"
                name="quantity"
                data-row={row}
                placeholder="Quantity"
                value={this.props.input.rows[row].quantity}
                onChange={this.trackInput(row, "textbox")}
              />
              <input
                type="text"
                name="gst"
                data-row={row}
                placeholder="GST"
                value={this.props.input.rows[row].gst}
                disabled={this.props.input.rows[row].pid === "" ? false : true}
                onChange={this.trackInput(row, "textbox")}
              />
            </div>
            <div>
              {this.props.refinedProductMatches &&
                this.props.currentActive == row &&
                this.props.refinedProductMatches.map(match => (
                  <div
                    className="matchRow"
                    data-row={row}
                    onClick={() => this.selectProduct(row, match)}
                  >
                    <div>{match.name}</div>
                    <div>{match.mrp}</div>
                    <div>{match.price}</div>
                    <div>{match.gst}</div>
                  </div>
                ))}
            </div>
          </div>
        ))}
        {this.props.redirect && <Redirect to={this.props.redirect} />}
      </div>
    );
  }
}

export default connect(Create, state => state);
