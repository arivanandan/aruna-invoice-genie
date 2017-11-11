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
    this.createInvoice = this.createInvoice.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
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
      if (e.target.value.length === 2) customer.get();
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
    this.quantityInput.focus();
    product.clearRefinedMatches();
  }

  selectCustomer(row, match) {
    trackInput.setCustomer(row, match);
    customer.clearRefinedMatches();
  }

  createInvoice() {
    const status = invoice.create(this.props.input);
  }

  handleKeyUp(e) {
    console.log("handleKeyUp", e.keycode);
    if (e.keyCode === 13) {
      if (this.props.highlightProductMatch !== null) {
        this.selectProduct(
          this.props.currentActive,
          this.props.refinedProductMatches[this.props.highlightProductMatch]
        );
        trackInput.clearProductHighlight();
      } else trackInput.addRow();
    }
    if (e.keyCode === 40)
      trackInput.highlightProductMatch(
        "+",
        this.props.refinedProductMatches.length
      );
    if (e.keyCode === 38)
      trackInput.highlightProductMatch(
        "-",
        this.props.refinedProductMatches.length
      );
  }

  render() {
    return (
      <div className="createContainer">
        <h2>
          Aruna Invoice Genie
          <input
            type="button"
            name="submit"
            className="createInvoice"
            value="Create Invoice"
            onClick={this.createInvoice}
          />
        </h2>
        <div className="igst">
          <span>IGST</span>
          <input
            id="igst"
            type="checkbox"
            value="IGST"
            placeholder="Product"
            checked={this.props.input.igst}
            onChange={trackInput.checkbox}
          />
          <label htmlFor="igst" />
        </div>
        <div className="customerAddress">
          <div className="nameId">
            <input
              type="text"
              name="cname"
              placeholder="Customer Name"
              value={this.props.input.customer.cname}
              onChange={this.findCustomer(this.props.input.customer.cid)}
            />
            <input
              type="text"
              name="cgstid"
              placeholder="Customer GSTID"
              value={this.props.input.customer.cgstid}
              onChange={trackInput.customerData}
            />
          </div>
          <div className="address">
            <input
              type="text"
              name="caddress"
              placeholder="Customer Address"
              value={this.props.input.customer.caddress}
              onChange={trackInput.customerData}
            />
          </div>
          <div>
            {this.props.refinedCustomerMatches &&
              this.props.refinedCustomerMatches.map(match => (
                <div
                  className="matchRow"
                  onClick={() => trackInput.setCustomer(match)}
                >
                  <span>{match.cname}</span>
                  <span>{match.caddress}</span>
                </div>
              ))}
          </div>
        </div>
        <div className="form-table">
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
                  disabled={
                    this.props.input.rows[row].pid === "" ? false : true
                  }
                  autoFocus
                  value={this.props.input.rows[row].name}
                  onChange={this.findProduct(
                    row,
                    this.props.input.rows[row].pid
                  )}
                  onKeyUp={this.handleKeyUp}
                />
                <input
                  type="text"
                  name="mrp"
                  data-row={row}
                  placeholder="MRP"
                  value={this.props.input.rows[row].mrp}
                  disabled={
                    this.props.input.rows[row].pid === "" ? false : true
                  }
                  onChange={this.trackInput(row, "textbox")}
                  onKeyUp={this.handleKeyUp}
                />
                <input
                  type="text"
                  name="price"
                  data-row={row}
                  placeholder="Selling Price"
                  value={this.props.input.rows[row].price}
                  onChange={this.trackInput(row, "textbox")}
                  onKeyUp={this.handleKeyUp}
                />
                <input
                  type="text"
                  name="quantity"
                  data-row={row}
                  placeholder="Quantity"
                  ref={input => { this.quantityInput = input; }}
                  value={this.props.input.rows[row].quantity}
                  onChange={this.trackInput(row, "textbox")}
                  onKeyUp={this.handleKeyUp}
                />
                <input
                  type="text"
                  name="gst"
                  data-row={row}
                  placeholder="GST"
                  value={this.props.input.rows[row].gst}
                  disabled={
                    this.props.input.rows[row].pid === "" ? false : true
                  }
                  onChange={this.trackInput(row, "textbox")}
                  onKeyUp={this.handleKeyUp}
                />
              </div>
              <div>
                {this.props.refinedProductMatches &&
                  this.props.currentActive == row &&
                  this.props.refinedProductMatches.map((match, matchIndex) => (
                    <div
                      className={
                        this.props.highlightProductMatch === matchIndex
                          ? "matchRow highlightProductMatch"
                          : "matchRow"
                      }
                      data-row={row}
                      onClick={() => this.selectProduct(row, match)}
                    >
                      <div>{match.name}</div>
                      <div>{match.mrp}</div>
                      <div>{match.price}</div>
                      <div>{null}</div>
                      <div>{match.gst}</div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
        <div className="createToolkit">
          <div>
            <input
              type="button"
              value="Add Item +"
              className="addRow"
              name="addRow"
              onClick={trackInput.addRow}
            />
          </div>
        </div>
        {this.props.redirect && <Redirect to={this.props.redirect} />}
      </div>
    );
  }
}

export default connect(Create, state => state);
