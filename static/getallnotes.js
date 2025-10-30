document.addEventListener("DOMContentLoaded", () => {
    fetchAllNotes();
});

function fetchAllNotes() {
    fetch("/getallnotes")
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("notes-container");
            container.innerHTML = "";

            data.forEach(note => {
                const noteDiv = document.createElement("div");
                noteDiv.classList.add("item");

                noteDiv.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.description}</p>
                `;

                container.appendChild(noteDiv);
            });
        })
        .catch(err => console.error("Error fetching notes:", err));
}