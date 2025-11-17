document.addEventListener("DOMContentLoaded", () => {
    fetchAllNotes();
});

function fetchAllNotes() {
    fetch("/getallnotes")
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => b.pined - a.pined);
            localStorage.setItem('notes', JSON.stringify(data))
            const container = document.getElementById("notes-container")
            container.innerHTML = ""

            data.forEach(note => {
                const noteDiv = document.createElement("div")
                noteDiv.classList.add("item")

                noteDiv.innerHTML = `
                <div class='category'>
                    <h4>${note.category}</h4>
                    <div class='icons'>
                        <i onclick='handleDownload(${note.id})' class="fas fa-download" aria-hidden="true"></i>
                        <i onclick='handlePin(${note.id})' style="color: ${note.pined ? 'yellow' : 'white'}" class="bi bi-pin-fill"></i>
                    </div>
                </div>
                <div class='title-row'>
                    <h3>${note.title}</h3>
                    <div class='custom-div'>
                        <button onclick='handleEdit(${note.id})'>Edit</button>
                        <button onclick='handleDelete(${note.id})'>Delete</button>
                    </div>
                </div>
                <p>${note.description}</p>
                `

                container.appendChild(noteDiv)
            });
        })
        .catch(err => console.error("Error fetching notes:", err))
}

function handleDownload(id) {
    console.log('Download')
    // Find the note from localStorage (or you can fetch from server)
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    const note = notes.find(n => n.id === id);

    if (!note) {
        alert("Note not found!");
        return;
    }

    const textContent =
        `Category: ${note.category}
Title: ${note.title}

${note.description}`

    // Create a fake download link
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title}.txt`; // File name
    a.click();

    // Cleanup
    URL.revokeObjectURL(url);
}

function handlePin(id) {
    fetch(`/pinnote?id=${id}`, { method: "POST" })
        .then(res => res.json())
        .then(() => fetchAllNotes())  // re-render sorted
        .catch(err => console.error(err));
}

function handleEdit(id) {
    window.location.href = `/findnote?id=${id}`;
}

function handleDelete(id) {
    console.log('Deleting note with id:', id);

    fetch(`/deletenote?id=${id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            fetchAllNotes();
        })
        .catch(err => console.error("Error deleting note:", err));
}

