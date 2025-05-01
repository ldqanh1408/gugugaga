
import {
  Home,
  Calendar,
  Note,
  NoteEditor,
  ChatBox,
  BackgroundPage,
  FontsPage,
  ColorsPage,
  SchedulePage,
  HistoryExpert,
  EnterLogin,
  ExpertManagement,
  Complaint,
  Therapy,
  MyTherapy,
  TodayMailsPage,
  ExploreYourselfPage
} from "../Pages";
import NoteViewer from "../Pages/Note/NoteViewer";
import SignUpBusiness from "../Pages/SignUpBusiness";

const routes = [
  { path: "/", element: <Home />, isPrivate: false },
  { path: "/calendar", element: <Calendar />, isPrivate: true },
  { path: "/note", element: <Note />, isPrivate: true },
  { path: "/chat", element: <ChatBox />, isPrivate: true },
  { path: "/note-editor", element: <NoteEditor />, isPrivate: true },

  {
    path: "/personalize/background",
    element: <BackgroundPage />,
    isPrivate: true,
  },
  { path: "/personalize/colors", element: <ColorsPage />, isPrivate: true },
  { path: "/personalize/fonts", element: <FontsPage />, isPrivate: true },
  {
    path: "/expert/schedule",
    element: <SchedulePage></SchedulePage>,
    isPrivate: true,
  },
  {
    path: "/expert/history",
    element: <HistoryExpert></HistoryExpert>,
    isPrivate: true,
  },
  {
    path: "/business/sign-up",
    element: <SignUpBusiness></SignUpBusiness>,
    isPrivate: false,
  },
  {
    path: "/login/enter",
    element: <EnterLogin></EnterLogin>,
    isPrivate: false,
  },
  {
    path: "/business/expert-list",
    element: <ExpertManagement></ExpertManagement>,
    isPrivate: true,
  },
  {
    path: "/business/complaints",
    element: <Complaint></Complaint>,
    isPrivate: true,
  },
  {
    path: "/therapy",
    element: <Therapy></Therapy>,
    isPrivate: true,
  },
  {
    path: "/me/therapy",
    element: <MyTherapy></MyTherapy>,
    isPrivate: true,
  },
  {
    path: "/explore-yourself",
    element: <ExploreYourselfPage></ExploreYourselfPage>,

    isPrivate: true,
  },
  {
    path: "/today-mails",
    element: <TodayMailsPage></TodayMailsPage>,
    isPrivate: true,
  },

];

export default routes;
