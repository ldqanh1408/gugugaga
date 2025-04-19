import { Navigation, Footer } from "../layouts";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  SignUp,
  Login,
  Profile,
  ChangePassword,
  ExploreYourselfPage,
} from "../Pages"; // 👈 thêm ExploreYourselfPage
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import routes from "./ConfigRouter"; // giữ nguyên nếu bạn dùng config riêng
import "../styles/common.css";
import "../styles/AppRouter.css";

function AppRouter() {
  return (
    <Router>
      <Navigation />
      <div className="content-wrapper">
        <Routes>
          <Route element={<PublicRoutes />}>
            {routes
              .filter((route) => !route.isPrivate)
              .map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
          </Route>
          <Route element={<PrivateRoutes />}>
            {routes
              .filter((route) => route.isPrivate)
              .map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
          </Route>
          <Route path="/explore-yourself" element={<ExploreYourselfPage />} />{" "}
          {/* 👈 thêm dòng này */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default AppRouter;
