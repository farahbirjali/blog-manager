import { useEffect, useState } from "react"
import jsPDF from "jspdf"
import { FaTrash, FaEdit, FaDownload } from "react-icons/fa"

type Comment = {
    id: string
    description: string
    comment_date: string
}

export default function Comments() {
    const [comments, setComments] = useState<Comment[]>([])
    const [description, setDescription] = useState("")
    const [commentDate, setCommentDate] = useState("")
    const [editId, setEditId] = useState<string | null>(null)

    const fetchComments = async () => {
        try {
            const res = await fetch("http://127.0.0.1:8000/api/comments")
            if (!res.ok) throw new Error("Error fetching comments")
            const data: Comment[] = await res.json()
            setComments(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error(err)
            setComments([])
        }
    }

    useEffect(() => { fetchComments() }, [])

    const handleCreate = async () => {
        const res = await fetch("http://127.0.0.1:8000/api/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description, comment_date: commentDate })
        })
        if (res.ok) { setDescription(""); setCommentDate(""); fetchComments() }
    }

    const handleUpdate = async (id: string) => {
        const res = await fetch(`http://127.0.0.1:8000/api/comments/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description, comment_date: commentDate })
        })
        if (res.ok) { setEditId(null); fetchComments() }
    }

    const handleDelete = async (id: string) => {
        await fetch(`http://127.0.0.1:8000/api/comments/${id}`, { method: "DELETE" })
        fetchComments()
    }

    const exportPDF = () => {
        const doc = new jsPDF()
        doc.text("Comments List", 10, 10)
        comments.forEach((c, i) => doc.text(`${i + 1}. ${c.description} (${c.comment_date})`, 10, 20 + i * 10))
        doc.save("comments.pdf")
    }

    return (
        <div>
            <h1>Comments</h1>

            <div className="form">
                <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
                <input type="date" value={commentDate} onChange={e => setCommentDate(e.target.value)} />
                {editId ?
                    <button onClick={() => handleUpdate(editId)}>Update</button> :
                    <button onClick={handleCreate}>Create</button>
                }
                <button onClick={exportPDF} className="pdf-btn"><FaDownload /> Export PDF</button>
            </div>

            <table>
                <thead>
                    <tr><th>Description</th><th>Date</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {comments.map(c => (
                        <tr key={c.id}>
                            <td>{c.description}</td>
                            <td>{c.comment_date}</td>
                            <td>
                                <button onClick={() => { setDescription(c.description); setCommentDate(c.comment_date); setEditId(c.id) }}><FaEdit /></button>
                                <button onClick={() => handleDelete(c.id)}><FaTrash /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}