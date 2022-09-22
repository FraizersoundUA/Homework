const hamb = document.querySelector("#hamb");
const popup = document.querySelector("#popup");
const menu = document.querySelector("#menu").cloneNode(1);
const bookService = document.querySelector("#book-service");
const bookServiceClose = document.querySelector("#book-service-close");
const bookServicePopup = document.querySelector("#book-service-popup");
const bookServicePopupOverlay = document.querySelector(".submit__form-overlay");
console.log(popup)

hamb.addEventListener("click", hambHandler);

function hambHandler(e) {
    e.preventDefault();
    popup.classList.toggle("open");
    hamb.classList.toggle("active");
    document.body.classList.toggle("menu-is-active")
    renderPopup();
}

function renderPopup() {
    popup.appendChild(menu);
}

if(bookService && bookServiceClose) {
    bookService.addEventListener("click", function (e) {
        e.preventDefault();
        bookServicePopup.classList.add("active");
        bookServicePopupOverlay.classList.add("active");
    })

    bookServiceClose.addEventListener("click", function () {
        bookServicePopup.classList.remove("active");
        bookServicePopupOverlay.classList.remove("active");
    })
}

