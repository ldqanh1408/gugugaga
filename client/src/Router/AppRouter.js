import { Navigation, Footer } from "../layouts";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import {
  SignUp,
  Login,
  Profile,
  ChangePassword,
  ExploreYourselfPage,
  TodayMailsPage,
} from "../Pages";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import routes from "./ConfigRouter";
import "../styles/common.css";
import "../styles/AppRouter.css";
import "bootstrap/dist/css/bootstrap.min.css";

const PageWrapper = ({ children }) => {
  const location = useLocation();
  const isMailPage = location.pathname === "/today-mails";

  if (isMailPage) {
    return children;
  }

  return (
    <>
      <Navigation />
      <div className="content-wrapper">{children}</div>
      <Footer />
    </>
  );
};

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicRoutes />}>
          {routes
            .filter((route) => !route.isPrivate)
            .map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={<PageWrapper>{route.element}</PageWrapper>}
              />
            ))}
        </Route>
        <Route element={<PrivateRoutes />}>
          {routes
            .filter((route) => route.isPrivate)
            .map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={<PageWrapper>{route.element}</PageWrapper>}
              />
            ))}
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
