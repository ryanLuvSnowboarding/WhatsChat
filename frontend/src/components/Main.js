import React, { useState } from "react";
import { Route, Switch, Redirect } from "react-router";

import Login from "./Login";
import Register from "./Register";
import Home from "./Home";

function Main(props) {
  const { isLoggedIn, handleLoggedIn } = props;

  const showLogin = () => {
    return isLoggedIn ? (
      <Redirect to="/home" />
    ) : (
      <Login handleLoggedIn={handleLoggedIn} />
    );
  };

  const showHome = () => {
    return isLoggedIn ? <Home /> : <Redirect to="/login" />;
  };
  return (
    <div className="main">
      {/* Rounter enables match different URL with different components for user interaction */}
      <Switch>
        <Route path="/" exact render={showLogin} />
        {/* using render because have to place components based on different logic */}
        <Route path="/login" render={showLogin} />
        <Route path="/register" component={Register} />
        <Route path="/home" render={showHome} />
      </Switch>
    </div>
  );
}

export default Main;
