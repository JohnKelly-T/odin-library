const myLibrary = [];

const itemsContainer = document.querySelector(".items-container");

const pageIconPath = "./img/placeholder.png";

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
    myLibrary.push(new Book(title, author, pages, isRead));
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
    bookTitle.textContent = book.title;
    const bookAuthor = document.createElement("span");
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

    itemsContainer.appendChild(card);

    return card;
}

addBookToLibrary("Book1", "Author1", 365, true);
addBookToLibrary("Book2", "Author2", 365, false);
addBookToLibrary("Book3", "Author3", 365, true);
addBookToLibrary("Book4", "Author4", 365, false);
addBookToLibrary("Book5", "Author5", 365, true);

for (let i = 0; i < myLibrary.length; i++) {
    let newCard = createCard(myLibrary[i]);

    itemsContainer.appendChild(newCard);
}