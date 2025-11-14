const form = document.getElementById('addNote');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const categoryInput = document.getElementById('category'); // 👈 Added

// ✅ Restore draft if exists (auto-save recovery)
window.addEventListener('DOMContentLoaded', () => {
  try {
    const draft = JSON.parse(localStorage.getItem('draftNote'));
    if (draft) {
      titleInput.value = draft.title || '';
      descInput.value = draft.description || '';
      if (categoryInput) categoryInput.value = draft.category || '';
      console.log('Draft restored from localStorage:', draft);
    }
  } catch (err) {
    console.error('Error reading draft from localStorage:', err);
  }
});

// ✅ Auto-save draft every 5 seconds
let lastDraft = '';
setInterval(() => {
  const currentDraft = {
    title: titleInput.value,
    description: descInput.value,
    category: categoryInput ? categoryInput.value : ''
  };

  const serialized = JSON.stringify(currentDraft);
  if (
    serialized !== lastDraft &&
    (currentDraft.title.trim() || currentDraft.description.trim())
  ) {
    localStorage.setItem('draftNote', serialized);
    lastDraft = serialized;
    console.log('Draft auto-saved at', new Date().toLocaleTimeString());
  }
}, 5000);

// ✅ Handle submission
form.addEventListener('submit', handleAddNote);

function handleAddNote(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const title = formData.get('title')?.trim() || '';
  const description = formData.get('description')?.trim() || '';
  const category = formData.get('category')?.trim() || 'Uncategorized';

  if (!title || !description) {
    alert('Please fill out both title and description before submitting.');
    return;
  }

  // ✅ 1. Save note locally (for offline / merge later)
  let localNotes = JSON.parse(localStorage.getItem('notes')) || [];
  const newNote = {
    id: Date.now(),
    title,
    description,
    category,
    pinned: false
  };
  localNotes.push(newNote);
  localStorage.setItem('notes', JSON.stringify(localNotes));

  // ✅ 2. Clear any saved draft
  localStorage.removeItem('draftNote');

  // ✅ 3. Send to backend (optional)
  fetch('/addnote', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        console.log('Note saved to server.');
        form.reset();
        window.location.href = '/';
      } else {
        console.error('Server error:', data.error);
        // alert('Failed to save note on server, but saved locally.');
      }
    })
    .catch(err => {
      console.error('Error sending note to server:', err);
      alert('Could not connect to server. Note saved locally.');
      // Still redirect so user can see the new note locally
      form.reset();
      window.location.href = '/';
    });
}
