import { Home, Calendar, Note, NoteEditor, ChatBox, BackgroundPage, FontsPage, ColorsPage } from '../Pages'
import NoteViewer from '../Pages/Note/NoteViewer';

const routes = [
    {path: '/', element: <Home />, isPrivate: false},
    {path: '/calendar', element: <Calendar />, isPrivate: true},
    {path: '/note', element: <Note />, isPrivate: true},
    {path: '/chat', element: <ChatBox />, isPrivate: true},
    {path: '/note-editor', element: <NoteEditor />, isPrivate: true},
    {path: '/personalize/background', element: <BackgroundPage />, isPrivate: true},
    {path: '/personalize/colors', element: <ColorsPage />, isPrivate: true},
    {path: '/personalize/fonts', element: <FontsPage />, isPrivate: true},
]

export default routes;