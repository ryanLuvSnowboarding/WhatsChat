import React from "react";
import logo from "../assets/images/logo.svg";

import { LogoutOutlined } from "@ant-design/icons";

function TopBar(props) {
  //function components
  const { isLoggedIn, handleLogout } = props;
  //props is sent by reference, is an object
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <span className="App-title">Around Web</span>
      {isLoggedIn ? (
        <LogoutOutlined className="logout" onClick={handleLogout} />
      ) : null}
    </header>
  );
}

export default TopBar;
