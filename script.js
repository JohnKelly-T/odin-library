let myLibrary = new Map();

const itemsContainer = document.querySelector(".items-container");
const dialog = document.querySelector("dialog");
const addButton = document.querySelector("#add-button");
const modalCancelButton = document.querySelector("#cancel-button");
const modalSaveButton = document.querySelector("#save-button");

const form = document.querySelector("form");
const filterOptions = document.querySelector("select[name='filter-options']")

const modalAction = document.querySelector(".modal-action");
const bookTitleInput = document.querySelector("form .book-title-input");
const bookAuthorInput = document.querySelector("form .book-author-input");
const bookStatus = document.querySelector("form [name='book-status'");
const bookPages = document.querySelector("form [name='book-pages'");
const errorDiv = document.querySelector("#error-div");

const pageIconPath = "./img/page-icon.png";

let id = 0;
let displayMode = "not-read";

document.addEventListener("DOMContentLoaded", function() {
    const storedLibrary = localStorage.getItem('library');

    if (storedLibrary) {
        // Convert back to Map
        myLibrary = new Map(JSON.parse(storedLibrary));
        console.log(myLibrary);
        displayBooks();
    }
});

function Book(title, author, pages, isRead, datetime) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
    this.datetime = datetime;

    this.info = () => {
        let isReadMessage = isRead ? "read" : "not read yet";

        return `${title} by ${author}, ${pages} pages, ${isReadMessage}`;
    }
}

function addBookToLibrary(title, author, pages, isRead) {
    myLibrary.set(++id, new Book(title, author, pages, isRead, new Date()));
}

function createCard(book, bookId) {
    // create card element
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-id", bookId);

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

    readStatus.addEventListener("change", () => {
        book.isRead = readStatus.checked;
        displayBooks();
    });

    cardDetails.appendChild(readStatusLabel);

    // create remove button
    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-button");

    removeButton.addEventListener("click", () => {
        let bookId = Number(card.getAttribute("data-id"));
        myLibrary.delete(bookId);
        displayBooks();
        saveToLocalStorage();
    });

    // create edit button
    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");

    editButton.addEventListener("click", () => {
        let bookId = Number(card.getAttribute("data-id"));
        let book = myLibrary.get(bookId);

        modalAction.textContent = "Edit book";
        bookTitleInput.textContent = book.title;
        bookAuthorInput.textContent = book.author;
        bookStatus.value = (book.isRead === true) ? "read" : "not-read";
        bookPages.value = book.pages;

        dialog.setAttribute("dialog-mode", "edit");
        dialog.setAttribute("card-id", bookId);
        dialog.showModal();
    });

    card.appendChild(editButton);
    card.appendChild(removeButton);

    itemsContainer.appendChild(card);

    return card;
}

function displayBooks() {
    itemsContainer.innerHTML = '';


    for (let [key, value] of myLibrary) {

        if (displayMode == "read") {
            if (!value.isRead) {
                continue;
            }
        } else if (displayMode == "not-read") {
            if (value.isRead) {
                continue;
            }
        }

        let newCard = createCard(value, key);
        itemsContainer.appendChild(newCard);
    }
}

function addErrorMessage(message) {
    let error = document.createElement("p");
    error.classList.add("error-message");
    error.textContent = message;
    errorDiv.appendChild(error);
}

function resetDialogForm() {
    dialog.setAttribute("card-id", null);
    modalAction.textContent = "";
    bookTitleInput.textContent = "";
    bookAuthorInput.textContent = "";
    errorDiv.innerHTML = "";
    form.reset();
}

function saveToLocalStorage() {
    localStorage.setItem('library', JSON.stringify(Array.from(myLibrary)));
}

form.addEventListener("submit", (e) => {
    // prevent page reload
    e.preventDefault();

    errorDiv.innerHTML = "";

    let isValid = true;

    // validation 
    if (bookTitleInput.textContent === "") {
        isValid = false;
        addErrorMessage("* Please enter the book's title");
    }

    if (bookAuthorInput.textContent === "") {
        isValid = false;
        addErrorMessage("* Please enter the book's author");
    }

    if (bookPages.value === "") {
        isValid = false;
        addErrorMessage("* Please enter the number of pages in the book");
    }

    if (!isValid) {
        return false;
    }

    let isRead = (bookStatus.value === "read") ? true : false;

    if (dialog.getAttribute("dialog-mode") === "add") {
        addBookToLibrary(bookTitleInput.textContent, bookAuthorInput.textContent, bookPages.value, isRead);
    } else {
        let bookId = Number(dialog.getAttribute("card-id"));
        let book = myLibrary.get(bookId);
        book.title = bookTitleInput.textContent;
        book.author = bookAuthorInput.textContent;
        book.pages = bookPages.value;
        book.isRead = isRead;
    }

    saveToLocalStorage();
    displayBooks();
    dialog.close();
    return true;
});

filterOptions.addEventListener("change", () => {
    displayMode = filterOptions.value;
    displayBooks();
});

addButton.addEventListener("click", () => {
    resetDialogForm();
    modalAction.textContent = "+ Add new book";
    dialog.setAttribute("dialog-mode", "add");
    dialog.showModal();
});

modalCancelButton.addEventListener("click", () => {
    dialog.close();
});