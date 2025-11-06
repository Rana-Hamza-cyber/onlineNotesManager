document.addEventListener("DOMContentLoaded", () => {
    fetchAllNotes();
});

function fetchAllNotes() {
    fetch("/getallnotes")
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('notes', JSON.stringify(data))
            const container = document.getElementById("notes-container");
            container.innerHTML = "";

            data.forEach(note => {
                const noteDiv = document.createElement("div");
                noteDiv.classList.add("item");

                noteDiv.innerHTML = `
                <div>
                        <h3>${note.title}</h3>
                        <div class='custom-div'>
                            <button onclick=handleEdit(${note.id})>Edit</button>
                            <button onclick=handleDelete(${note.id})>Delete</button>
                        </div>
                    </div>
                <p>${note.description}</p>
                `;

                container.appendChild(noteDiv);
            });
        })
        .catch(err => console.error("Error fetching notes:", err));
}

function handleEdit(id) {
    console.log('Edit', id)
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