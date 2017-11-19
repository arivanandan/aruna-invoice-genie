import React, { Component } from "react";
import { connect } from "redux-jetpack";
import * as trackInput from "../../actions/report-input";
import * as report from "../../actions/report";

class Report extends Component {
  render() {
    return (
      <div id="reportContainer">
        <div id="reportToolbelt">
          <span>From</span>
          <input
            type="date"
            name="from"
            value={this.props.report.from}
            onChange={trackInput.captureDate}
          />
          <span>To</span>
          <input
            type="date"
            name="to"
            value={this.props.report.to}
            onChange={trackInput.captureDate}
          />
          <input
            type="button"
            value="Generate Report"
            onClick={() =>
              report.get(this.props.report.from, this.props.report.to)}
          />
          <div id="printButton">
            <input type="button" value="Print" onClick={window.print} />
          </div>
        </div>
        {this.props.report.rows.length > 0 && (
          <div>
            <div id="reportTable">
              <div id="reportTableHeader">
                <div>Date</div>
                <div>Invoice</div>
                <div>GST No.</div>
                <div>GST Rate</div>
                <div>CGST</div>
                <div>SGST</div>
                <div>IGST</div>
                <div>Amount</div>
              </div>
              {Object.keys(this.props.report.rows).map(row => (
                <div id="reportDataRow">
                  <div id="reportRow-date">
                    {this.props.report.rows[row].dt}
                  </div>
                  <div id="reportRow-invoice">
                    {this.props.report.rows[row].iid}
                  </div>
                  <div id="reportRow-cgstId">
                    {this.props.report.rows[row].cgstid}
                  </div>
                  <div id="reportRow-money">
                    {Object.keys(this.props.report.rows[row].gst).map(rate => (
                      <div id="reportMoneyRow">
                        <div id="reportRow-gstRate">{rate}</div>
                        {this.props.report.rows[row].igst && (
                          <div>
                            {this.props.report.rows[row].gst[rate].gst.toFixed(
                              2
                            )}
                          </div>
                        )}
                        {this.props.report.rows[row].igst && <div />}
                        {this.props.report.rows[row].igst && <div />}
                        {!this.props.report.rows[row].igst && (
                          <div>
                            {(this.props.report.rows[row].gst[rate].gst / 2
                            ).toFixed(2)}
                          </div>
                        )}
                        {!this.props.report.rows[row].igst && (
                          <div>
                            {(this.props.report.rows[row].gst[rate].gst / 2
                            ).toFixed(2)}
                          </div>
                        )}
                        {!this.props.report.rows[row].igst && <div />}

                        <div>
                          {this.props.report.rows[row].gst[rate].amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(Report, state => state);
