import React, { Component } from "react";

const NavBar = () => (
  <div className="navBar">
    <div>
      <a href="/">
        <h2>Aruna Invoice Genie</h2>
      </a>
    </div>
    <div className="links">
      <a href="/">Create Invoice</a>
      <a href="/report">Report</a>
      <a href="/product">Manage Products</a>
    </div>
  </div>
);

export default NavBar;
