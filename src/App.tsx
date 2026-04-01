import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Dashboard from "./components/Dashboard"
import Authors from "./components/Authors"
import Posts from "./components/Posts"
import Comments from "./components/Comments"

type Page = "dashboard" | "authors" | "posts" | "comments"

export default function App() {
  const [page, setPage] = useState<Page>("dashboard")

  const renderPage = () => {
    switch (page) {
      case "authors": return <Authors />
      case "posts": return <Posts />
      case "comments": return <Comments />
      default: return <Dashboard />
    }
  }

  return (
    <div className="app">
      <Sidebar setPage={setPage} />
      <main className="main">{renderPage()}</main>
    </div>
  )
}