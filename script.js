let myLibrary = new Map();

const itemsContainer = document.querySelector("#items-container");
const dialog = document.querySelector("dialog");
const addButton = document.querySelector("#add-button");
const modalCancelButton = document.querySelector("#cancel-button");
const modalSaveButton = document.querySelector("#save-button");

const form = document.querySelector("form");
const filterOptions = document.querySelector("#filter-options");
const sortOptions = document.querySelector("#sort-options");

const cardViewButton = document.querySelector("#card-view");
const listViewButton = document.querySelector("#list-view");

const modalAction = document.querySelector(".modal-action");
const bookTitleInput = document.querySelector("form .book-title-input");
const bookAuthorInput = document.querySelector("form .book-author-input");
const bookStatus = document.querySelector("form [name='book-status'");
const bookPages = document.querySelector("form [name='book-pages'");
const errorDiv = document.querySelector("#error-div");

const pageIconPath = "./img/page-icon.png";

let idCount = 0;
let filterMode = "all";
let sortMode = "oldest";
let displayMode = "card";

document.addEventListener("DOMContentLoaded", function() {
    const storedIdCount = localStorage.getItem('idCount');
    const storedLibrary = localStorage.getItem('library');
    const storedfilterMode = localStorage.getItem('filterMode');

    if (storedIdCount) {
        idCount = storedIdCount;
    }

    if (storedLibrary) {
        // Convert back to Map
        myLibrary = new Map(
            JSON.parse(storedLibrary).map(([key, value]) => [key, { ...value, dateAdded: new Date(value.dateAdded) }])
        );
        console.log(myLibrary);
        
    } else {
        addBookToLibrary("Clean Code", "Robert C. Martin", 464, false, new Date(new Date().getTime() + 1000));
        addBookToLibrary("The Pragmatic Programmer", "Andrew Hunt & David Thomas", 352, false, new Date(new Date().getTime() + 2000));
        addBookToLibrary("Design Patterns", "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides", 395, false, new Date(new Date().getTime() + 3000));
    }

    displayBooks();


});

class Book {
    constructor(title, author, pages, isRead, dateAdded) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = isRead;
        this.dateAdded = dateAdded;
    }
}

function addBookToLibrary(title, author, pages, isRead, date = new Date()) {
    myLibrary.set(++idCount, new Book(title, author, pages, isRead, date));
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
    pageCount.textContent = book.pages;
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
        saveToLocalStorage();
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
        moveCaretToEnd(bookTitleInput);
        bookAuthorInput.textContent = book.author;
        bookStatus.value = (book.isRead === true) ? "read" : "not-read";
        bookPages.value = book.pages;

        dialog.setAttribute("dialog-mode", "edit");
        dialog.setAttribute("item-id", bookId);
        dialog.showModal();
    });

    card.appendChild(editButton);
    card.appendChild(removeButton);

    itemsContainer.appendChild(card);

    return card;
}

function createTableRow(book, bookId) {
    const trow = document.createElement("tr");
    trow.setAttribute("data-id", bookId);

    const titleData = document.createElement("td");
    titleData.textContent = book.title;

    const authorData = document.createElement("td");
    authorData.textContent = book.author;

    const pagesData = document.createElement("td");
    pagesData.textContent = book.pages;

    const statusData = document.createElement("td");
    const readStatusLabel = document.createElement("label");
    readStatusLabel.textContent = "Read";
    const readStatus = document.createElement("input");
    readStatus.type = "checkbox";
    readStatus.name = "book-read-status";
    readStatus.checked = book.isRead;
    readStatusLabel.appendChild(readStatus);

    readStatus.addEventListener("change", (e) => {
        book.isRead = readStatus.checked;
        saveToLocalStorage();
        displayBooks();
    });

    statusData.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    statusData.appendChild(readStatusLabel);

    const deleteCell = document.createElement("td");
    const removeButton = document.createElement("button");
    removeButton.classList.add("table-remove-button");

    deleteCell.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    removeButton.addEventListener("click", () => {
        let bookId = Number(trow.getAttribute("data-id"));
        myLibrary.delete(bookId);
        displayBooks();
        saveToLocalStorage();
    });

    deleteCell.appendChild(removeButton);

    trow.appendChild(titleData);
    trow.appendChild(authorData);
    trow.appendChild(pagesData);
    trow.appendChild(statusData);
    trow.appendChild(deleteCell);

    trow.addEventListener("click", (e) => {
        let bookId = Number(trow.getAttribute("data-id"));
        let book = myLibrary.get(bookId);

        modalAction.textContent = "Edit book";
        bookTitleInput.textContent = book.title;
        bookAuthorInput.textContent = book.author;
        bookStatus.value = (book.isRead === true) ? "read" : "not-read";
        bookPages.value = book.pages;

        dialog.setAttribute("dialog-mode", "edit");
        dialog.setAttribute("item-id", bookId);
        dialog.showModal();
    });

    return trow;
}

function createTable() {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const tableHeadings = ["Title", "Author", "Pages", "Status", ""];

    for (let heading of tableHeadings) {
        let th = document.createElement("th");
        th.textContent = heading;
        thead.appendChild(th);
    }

    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
}

function displayBooks() {
    itemsContainer.innerHTML = '';

    sortBooks();

    if (displayMode === "card") {
        itemsContainer.classList.add("card-view-container");

        for (let [key, value] of myLibrary) {

            if (filterMode == "read") {
                if (!value.isRead) {
                    continue;
                }
            } else if (filterMode == "not-read") {
                if (value.isRead) {
                    continue;
                }
            }
    
            let newCard = createCard(value, key);
            itemsContainer.appendChild(newCard);
        }
    }

    if (displayMode === "list") {
        itemsContainer.classList.remove("card-view-container");
        let table = createTable();

        for (let [key, value] of myLibrary) {
            if (filterMode == "read") {
                if (!value.isRead) {
                    continue;
                }
            } else if (filterMode == "not-read") {
                if (value.isRead) {
                    continue;
                }
            }

            let newRow = createTableRow(value, key);
            table.querySelector("tbody").appendChild(newRow);
        }

        itemsContainer.appendChild(table);
    }

    
}

function sortBooks() {

    if (sortMode === "oldest") {
        myLibrary = new Map(
            Array.from(myLibrary.entries()).sort((a, b) => a[1].dateAdded - b[1].dateAdded)
        );
    } else if (sortMode === "newest") {
        myLibrary = new Map(
            Array.from(myLibrary.entries()).sort((a, b) => b[1].dateAdded - a[1].dateAdded)
        );
    } else if (sortMode === "a-z") {
        myLibrary = new Map(
            Array.from(myLibrary.entries()).sort((a, b) => a[1].title.localeCompare(b[1].title))
        );
    } else if (sortMode === "z-a") {
        myLibrary = new Map(
            Array.from(myLibrary.entries()).sort((a, b) => b[1].title.localeCompare(a[1].title))
        );
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
    localStorage.setItem('idCount', idCount);
    localStorage.setItem('library', JSON.stringify(Array.from(myLibrary)));
}

function moveCaretToEnd(contentEditableElement) {
    const range = document.createRange();
    const selection = window.getSelection();
    range.setStart(contentEditableElement, contentEditableElement.childNodes.length);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
};


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
        let bookId = Number(dialog.getAttribute("item-id"));
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
    filterMode = filterOptions.value;
    displayBooks();
});

sortOptions.addEventListener("change", () => {
    sortMode = sortOptions.value;
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

cardViewButton.addEventListener("click", () => {
    displayMode = "card";
    itemsContainer.classList.add("card-view-container");

    displayBooks();
});

listViewButton.addEventListener("click", () => {
    displayMode = "list";
    itemsContainer.classList.remove("card-view-container");

    displayBooks();
});