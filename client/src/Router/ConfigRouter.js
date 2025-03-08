import { Home, Calendar, Note } from '../Pages'

const routes = [
    {path: '/', element: <Home />, isPrivate: false},
    {path: '/calendar', element: <Calendar />, isPrivate: true},
    {path: '/note', element: <Note />, isPrivate: true},
]

export default routes;