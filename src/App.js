import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./componentes/home/home";
import MiAdministracion from "./componentes/miAdministracion/miAdministracion";

function App() {
  return (
    <Router>
      <div>
        <Home />

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/miAdministracion">
            <MiAdministracion />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
