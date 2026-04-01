import { useEffect, useState } from "react"
import jsPDF from "jspdf"
import { FaTrash, FaEdit, FaDownload } from "react-icons/fa"

type Post = {
    id: string
    subject: string
    status: string
}

export default function Posts() {
    const [posts, setPosts] = useState<Post[]>([])
    const [subject, setSubject] = useState("")
    const [status, setStatus] = useState("")
    const [editId, setEditId] = useState<string | null>(null)

    const fetchPosts = async () => {
        try {
            const res = await fetch("http://127.0.0.1:8000/api/posts")
            if (!res.ok) throw new Error("Error fetching posts")
            const data: Post[] = await res.json()
            setPosts(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error(err)
            setPosts([])
        }
    }

    useEffect(() => { fetchPosts() }, [])

    const handleCreate = async () => {
        const res = await fetch("http://127.0.0.1:8000/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subject, status })
        })
        if (res.ok) {
            setSubject(""); setStatus("")
            fetchPosts()
        }
    }

    const handleUpdate = async (id: string) => {
        const res = await fetch(`http://127.0.0.1:8000/api/posts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subject, status })
        })
        if (res.ok) { setEditId(null); fetchPosts() }
    }

    const handleDelete = async (id: string) => {
        await fetch(`http://127.0.0.1:8000/api/posts/${id}`, { method: "DELETE" })
        fetchPosts()
    }

    const exportPDF = () => {
        const doc = new jsPDF()
        doc.text("Posts List", 10, 10)
        posts.forEach((p, i) => doc.text(`${i + 1}. ${p.subject} (${p.status})`, 10, 20 + i * 10))
        doc.save("posts.pdf")
    }

    return (
        <div>
            <h1>Posts</h1>

            <div className="form">
                <input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
                <input placeholder="Status" value={status} onChange={e => setStatus(e.target.value)} />
                {editId ?
                    <button onClick={() => handleUpdate(editId)}>Update</button> :
                    <button onClick={handleCreate}>Create</button>
                }
                <button onClick={exportPDF} className="pdf-btn"><FaDownload /> Export PDF</button>
            </div>

            <table>
                <thead>
                    <tr><th>Subject</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {posts.map(p => (
                        <tr key={p.id}>
                            <td>{p.subject}</td>
                            <td>{p.status}</td>
                            <td>
                                <button onClick={() => { setSubject(p.subject); setStatus(p.status); setEditId(p.id) }}><FaEdit /></button>
                                <button onClick={() => handleDelete(p.id)}><FaTrash /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}