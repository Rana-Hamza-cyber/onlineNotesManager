document.addEventListener("DOMContentLoaded", () => {
    fetchAllNotes();
});

function fetchAllNotes() {
    fetch("/getallnotes")
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('notes', JSON.stringify(data))
            const container = document.getElementById("notes-container")
            container.innerHTML = ""

            data.forEach(note => {
                const noteDiv = document.createElement("div")
                noteDiv.classList.add("item")

                noteDiv.innerHTML = `
                <div>
                        <h3>${note.title}</h3>
                        <div class='custom-div'>
                            <button onclick=handleEdit(${note.id})>Edit</button>
                            <button onclick=handleDelete(${note.id})>Delete</button>
                        </div>
                    </div>
                <p>${note.description}</p>
                `

                container.appendChild(noteDiv)
            });
        })
        .catch(err => console.error("Error fetching notes:", err))
}

function handleEdit(id){
    window.location.href = `/findnote?id=${id}`;
}

// function handleEdit(id) {
//     console.log('Edit', id)

//     fetch(`updatenote?id=${id}`)
//         .then(response => response.json())
//         .then(data => {
//             const container = document.getElementById("notes-container")
//             container.innerHTML = ""

//             data.forEach(note => {
//                 const form = document.createElement('form')
//                 form.action = '/updatesinglenote'
//                 form.method = 'POST'
//                 form.classList.add('item-template')

//                 const input = document.createElement('input')
//                 input.type = 'text'
//                 input.name = 'title'
//                 input.id = 'title'
//                 input.value = note.title

//                 const textarea = document.createElement('textarea')
//                 textarea.name = 'description'
//                 textarea.id = 'description'
//                 textarea.rows = '10'
//                 textarea.value = note.description

//                 const hiddenId = document.createElement('input');
//                 hiddenId.type = 'hidden';
//                 hiddenId.name = 'id';
//                 hiddenId.value = note.id;

//                 const button = document.createElement('button')
//                 button.type = 'submit'
//                 button.textContent = 'Update Note'

//                 form.appendChild(hiddenId)
//                 form.appendChild(input)
//                 form.appendChild(textarea)
//                 form.appendChild(button)
//                 container.appendChild(form)
//             })
//         })
//         .catch(err => console.error("Error fetching note:", err));
// }

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