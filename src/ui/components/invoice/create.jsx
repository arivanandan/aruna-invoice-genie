import React, { Component } from "react";
import { Redirect } from "react-router";
import { connect } from "redux-jetpack";
import * as trackInput from "../../actions/input-track";
import * as invoice from "../../actions/invoice";
import * as product from "../../actions/product";

class Create extends Component {
  constructor() {
    super();
    this.create = this.create.bind(this);
  }

  componentWillUpdate() {}

  findProduct(row) {
    return function(e) {
      trackInput.setActive(row);
      if (e.target.value.length === 2) product.findMatch(e.target.value);
      else if (e.target.value.length > 2) product.refineMatches(e.target.value);
      trackInput.textbox(e, row);
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
            value="Addressee"
            placeholder="Product"
            checked={this.props.input.addressee}
            onChange={trackInput.checkbox}
          />
          Addressee
          <input
            type="checkbox"
            value="IGST"
            placeholder="Product"
            checked={this.props.input.igst}
            onChange={trackInput.checkbox}
          />
          IGST
        </div>
        {this.props.input.addressee && (
          <div className="inputAddress">
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
          </div>
        )}
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
            <div className="textHeaders">
              <div>Product Name</div>
              <div>MRP</div>
              <div>Selling Price</div>
              <div>Quantity</div>
            </div>
            <div className="radioHeaders">
              <div>0%</div>
              <div>5%</div>
              <div>12%</div>
              <div>18%</div>
              <div>28%</div>
            </div>
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
                onChange={this.findProduct(row)}
              />
              <input
                type="text"
                name="mrp"
                data-row={row}
                placeholder="MRP"
                value={this.props.input.rows[row].mrp}
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
                name={`gst_${row}`}
                type="radio"
                value="0"
                data-row={row}
                checked={this.props.input.rows[row].gst === "0"}
                onChange={this.trackInput(row, "radio")}
              />
              <input
                name={`gst_${row}`}
                type="radio"
                value="5"
                data-row={row}
                checked={this.props.input.rows[row].gst === "5"}
                onChange={this.trackInput(row, "radio")}
              />
              <input
                name={`gst_${row}`}
                type="radio"
                value="12"
                data-row={row}
                checked={this.props.input.rows[row].gst === "12"}
                onChange={this.trackInput(row, "radio")}
              />
              <input
                name={`gst_${row}`}
                type="radio"
                value="18"
                data-row={row}
                checked={this.props.input.rows[row].gst === "18"}
                onChange={this.trackInput(row, "radio")}
              />
              <input
                name={`gstPercent_${row}`}
                type="radio"
                value="28"
                data-row={row}
                checked={this.props.input.rows[row].gst === "28"}
                onChange={this.trackInput(row, "radio")}
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
