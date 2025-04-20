import {Navigation, Footer} from "../layouts";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { SignUp, Login, Profile, ChangePassword, Personalize } from "../Pages";
import  PrivateRoutes  from "./PrivateRoutes";
import  PublicRoutes  from "./PublicRoutes";
import  routes  from "./ConfigRouter";
import "../styles/common.css"
import "../styles/AppRouter.css";
import 'bootstrap/dist/css/bootstrap.min.css';


function AppRouter() {
  return (
    <Router>
      <Navigation />
      <div className="content-wrapper">
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

          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/personalize" element={<Personalize />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />"
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default AppRouter;
