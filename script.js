const myLibrary = new Map();

const itemsContainer = document.querySelector(".items-container");
const dialog = document.querySelector("dialog");
const addButton = document.querySelector("#add-button");
const modalCancelButton = document.querySelector("#cancel-button");
const modalSaveButton = document.querySelector("#save-button");

const form = document.querySelector("form");

const bookTitleInput = document.querySelector("form .book-title-input");
const bookAuthorInput = document.querySelector("form .book-author-input");
const bookStatus = document.querySelector("form [name='book-status'");
const bookPages = document.querySelector("form [name='book-pages'");
const errorDiv = document.querySelector("#error-div");

const pageIconPath = "./img/page-icon.png";

let id = 0;

function Book(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;

    this.info = () => {
        let isReadMessage = isRead ? "read" : "not read yet";

        return `${title} by ${author}, ${pages} pages, ${isReadMessage}`;
    }
}

function addBookToLibrary(title, author, pages, isRead) {
    myLibrary.set(id++, new Book(title, author, pages, isRead));
}

function createCard(book) {
    // create card element
    const card = document.createElement("div");
    card.classList.add("card");

    // create card info wrapper and append to card
    const cardInfo = document.createElement("div");
    cardInfo.classList.add("card-info");
    card.appendChild(cardInfo);

    // create span elements
    const bookTitle = document.createElement("span");
    bookTitle.classList.add("book-title");
    bookTitle.textContent = book.title;
    const bookAuthor = document.createElement("span");
    bookAuthor.classList.add("book-author")
    bookAuthor.textContent = "by " + book.author;

    // append span elements to card info
    cardInfo.appendChild(bookTitle);
    cardInfo.appendChild(bookAuthor);

    // create book details wrapper 
    const cardDetails = document.createElement("div");
    cardDetails.classList.add("card-details");
    card.appendChild(cardDetails);

    // create book details elements
    const pageCount = document.createElement("span");
    pageCount.classList.add("book-pages");
    pageCount.textContent = book.pages.toString();
    cardDetails.appendChild(pageCount);

    const pageIcon = document.createElement("img");
    pageIcon.setAttribute("src", pageIconPath);
    pageIcon.classList.add("page-icon");
    pageIcon.alt = "page icon";
    cardDetails.appendChild(pageIcon);

    const readStatusLabel = document.createElement("label");
    readStatusLabel.textContent = "Read";
    
    const readStatus = document.createElement("input");
    readStatus.type = "checkbox";
    readStatus.name = "book-read-status";
    readStatus.checked = book.isRead;
    readStatusLabel.appendChild(readStatus);

    cardDetails.appendChild(readStatusLabel);

    // create remove button
    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-button");

    // create edit button
    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");

    card.appendChild(editButton);
    card.appendChild(removeButton);

    itemsContainer.appendChild(card);

    return card;
}

function displayBooks() {
    itemsContainer.innerHTML = '';

    for (let [key, value] of myLibrary) {
        let newCard = createCard(value);
    
        itemsContainer.appendChild(newCard);
    }
}

function validateForm(e) {
    let isRead = (bookStatus.value === "read") ? true : false;
    addBookToLibrary(bookTitleInput.textContent, bookAuthorInput.textContent, bookPages.value, isRead);
    // clear container
    itemsContainer.innerHTML = '';
    displayBooks();

    bookTitleInput.textContent = '';
    bookAuthorInput.textContent = '';
    form.reset();

    dialog.close();
    return true;
}

addButton.addEventListener("click", () => {
    dialog.showModal();
});

modalCancelButton.addEventListener("click", () => {
    dialog.close();
});

dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
        dialog.close();
    }
})

// addBookToLibrary("Book1", "Author1", 365, true);
// addBookToLibrary("Harry Potter and the Order of the Phoenix", "J.K. Rowling", 365, false);
// addBookToLibrary("Lorem ipsum Dolo emet the quick brown fox jumps over the lazy dog", "Author3", 365, true);
// addBookToLibrary("Book4", "Author4", 365, false);
// addBookToLibrary("Book5", "Author5", 365, true);

