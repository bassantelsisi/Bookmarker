document.getElementById('bookmarkForm').addEventListener('submit', addBookmark);

const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' +
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
    '((\\d{1,3}\\.){3}\\d{1,3}))' +
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
    '(\\?[;&a-z\\d%_.~+=-]*)?' +
    '(\\#[-a-z\\d_]*)?$',
    'i'
);

function addBookmark(e) {
    e.preventDefault();

    const siteName = document.getElementById('siteName').value.trim();
    const siteUrl = document.getElementById('siteUrl').value.trim();
    
    if (!siteName) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please enter a site name!",
        });
        return;
    }

    if (!siteUrl) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please enter a site URL!",
        });
        return;
    }

    // Check duplicate site names
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    if (bookmarks.some(bookmark => bookmark.name.toLowerCase() === siteName.toLowerCase())) {
        Swal.fire({
            icon: "error",
            title: "Already added!",
            text: "A bookmark with this name already exists!",
        });
        return;
    }

    try {
        new URL(siteUrl);
        if (!urlPattern.test(siteUrl)) {
            throw new Error('Invalid URL format');
        }

        const bookmark = {
            name: siteName,
            url: siteUrl
        };

        bookmarks.push(bookmark);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        
        Swal.fire({
            icon: "success",
            title: "Bookmark Saved!",
            text: `Your bookmark for "${siteName}" has been saved.`,
        });
        
        document.getElementById('bookmarkForm').reset();
        displayBookmarks();
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Invalid URL",
            text: "Please enter a valid URL (e.g., https://example.com).",
        });
    }
}

function displayBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    const bookmarkList = document.getElementById('bookmarkList');

    bookmarkList.innerHTML = bookmarks.map((bookmark, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${bookmark.name}</td>
            <td><a href="${bookmark.url}" target="_blank" class="btn btn-success">Visit</a></td>
            <td><button onclick="deleteBookmark(${index})" class="btn btn-danger">Delete</button></td>
        </tr>
    `).join('');
}

function deleteBookmark(index) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarks.splice(index, 1);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    displayBookmarks();
}

displayBookmarks();