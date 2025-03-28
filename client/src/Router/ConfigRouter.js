import { Home, Calendar, Note, ChatBox, NoteEditor } from '../Pages'
import NoteViewer from '../Pages/Note/NoteViewer';

const routes = [
    {path: '/', element: <Home />, isPrivate: false},
    {path: '/calendar', element: <Calendar />, isPrivate: true},
    {path: '/note', element: <Note />, isPrivate: true},
    {path: '/chat', element: <ChatBox />, isPrivate: true},
    {path: '/note-editor', element: <NoteEditor />, isPrivate: true},
]

export default routes;