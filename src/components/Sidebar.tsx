import { FaUser, FaClipboard, FaComment, FaTachometerAlt } from "react-icons/fa"

type Props = {
    setPage: (page: "dashboard" | "authors" | "posts" | "comments") => void
}

export default function Sidebar({ setPage }: Props) {
    return (
        <aside className="sidebar">
            <h2 className="logo">BlogManager</h2>
            <button onClick={() => setPage("dashboard")}><FaTachometerAlt /> Dashboard</button>
            <button onClick={() => setPage("authors")}><FaUser /> Authors</button>
            <button onClick={() => setPage("posts")}><FaClipboard /> Posts</button>
            <button onClick={() => setPage("comments")}><FaComment /> Comments</button>
        </aside>
    )
}