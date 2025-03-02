import {Navigation} from "../layouts";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Home, Calendar, Note, SignUp, Login } from "../Pages";
import  PrivateRoutes  from "./PrivateRoutes";
import  PublicRoutes  from "./PublicRoutes";
import  routes  from "./ConfigRouter";

function AppRouter() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route element={<PublicRoutes />} >
          {routes.filter(route => !route.isPrivate).map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>

        <Route element={<PrivateRoutes />} >
          {routes.filter(route => route.isPrivate).map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>

        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />"
      </Routes>
    </Router>
  );
}

export default AppRouter;
