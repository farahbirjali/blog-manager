import { useEffect, useState } from "react"
import jsPDF from "jspdf"
import { FaTrash, FaEdit, FaDownload } from "react-icons/fa"

type Author = {
    id: string
    first_name: string
    last_name: string
    birth_date: string
}

export default function Authors() {
    const [authors, setAuthors] = useState<Author[]>([])
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [editId, setEditId] = useState<string | null>(null)

    const fetchAuthors = async () => {
        try {
            const res = await fetch("http://127.0.0.1:8000/api/authors")
            if (!res.ok) throw new Error("Error fetching authors")
            const data: Author[] = await res.json()
            setAuthors(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error(err)
            setAuthors([])
        }
    }

    useEffect(() => { fetchAuthors() }, [])

    const handleCreate = async () => {
        const res = await fetch("http://127.0.0.1:8000/api/authors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ first_name: firstName, last_name: lastName, birth_date: birthDate })
        })
        if (res.ok) {
            setFirstName(""); setLastName(""); setBirthDate("")
            fetchAuthors()
        }
    }

    const handleUpdate = async (id: string) => {
        const res = await fetch(`http://127.0.0.1:8000/api/authors/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ first_name: firstName, last_name: lastName, birth_date: birthDate })
        })
        if (res.ok) { setEditId(null); fetchAuthors() }
    }

    const handleDelete = async (id: string) => {
        await fetch(`http://127.0.0.1:8000/api/authors/${id}`, { method: "DELETE" })
        fetchAuthors()
    }

    const exportPDF = () => {
        const doc = new jsPDF()
        doc.text("Authors List", 10, 10)
        authors.forEach((a, i) => doc.text(`${i + 1}. ${a.first_name} ${a.last_name} (${a.birth_date})`, 10, 20 + i * 10))
        doc.save("authors.pdf")
    }

    return (
        <div>
            <h1>Authors</h1>

            <div className="form">
                <input placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                <input placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
                <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
                {editId ?
                    <button onClick={() => handleUpdate(editId)}>Update</button> :
                    <button onClick={handleCreate}>Create</button>
                }
                <button onClick={exportPDF} className="pdf-btn"><FaDownload /> Export PDF</button>
            </div>

            <table>
                <thead>
                    <tr><th>Full Name</th><th>Birth Date</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {authors.map(a => (
                        <tr key={a.id}>
                            <td>{a.first_name} {a.last_name}</td>
                            <td>{a.birth_date}</td>
                            <td>
                                <button onClick={() => { setFirstName(a.first_name); setLastName(a.last_name); setBirthDate(a.birth_date); setEditId(a.id) }}><FaEdit /></button>
                                <button onClick={() => handleDelete(a.id)}><FaTrash /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}