init();
let color = "";
let id = "";
let quantity = "";
const cartItem = document.querySelector("#cart__items");

let regexEmail = new RegExp(
  "^[a-zA-Z0-9.-_]+@{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$",
  "g"
);
let regexFirstName = new RegExp("^([^0-9]*).{3}$");
let regexLastName = new RegExp("^([^0-9]*).{3}$");
let regexCity = new RegExp("^([^0-9]*).{3}$");
let regexAddress = new RegExp("[A-Za-z0-9 ]{6}$");
let orderButton = document.querySelector("#order");

// Au clique sur commander verifier si les champs sont bons et si oui rediriger vers la page confirmation
const orderInput = document.querySelector("#order");
orderInput.addEventListener("click", async (e) => {
  const checkReturn = check();
  const invalid = await checkProductLS();
  e.preventDefault();
  if (checkReturn && !invalid) {
    confirmCart();
  } else if (!checkReturn) {
    let emailInput = document.querySelector("#email");
    displayError(
      emailInput.value,
      "emailErrorMsg",
      regexEmail,
      "une adresse e-mail",
      "au format example@gmail.com"
    );

    let firstNameInput = document.querySelector("#firstName");
    displayError(
      firstNameInput.value,
      "firstNameErrorMsg",
      regexFirstName,
      "un prénom",
      "supérieur à 2 lettres"
    );

    let lastNameInput = document.querySelector("#lastName");
    displayError(
      lastNameInput.value,
      "lastNameErrorMsg",
      regexLastName,
      "un nom",
      "supérieur à 2 lettres"
    );

    let cityInput = document.querySelector("#city");
    displayError(
      cityInput.value,
      "cityErrorMsg",
      regexCity,
      "une ville",
      "supérieur à 2 lettres"
    );

    let addressInput = document.querySelector("#address");
    displayError(
      addressInput.value,
      "addressErrorMsg",
      regexAddress,
      "une adresse",
      "supérieur à 6 lettres"
    );
  } else if (invalid) {
    alert("Il n'y a aucun produit dans le panier");
  }
});



/************************************************************************************
 *                                         Async Functions
 ***********************************************************************************/

// Fonction lancée au lancement de la page
async function init () {
  const productLS = await getProductLS();
  displayProduct(productLS);
  deleteItem(productLS);
  totalQuantity();
  checkProductLS();
};

// Vérifie si le localStorage est vide
async function checkProductLS() {
  const productLS = await getProductLS();
  if (productLS.length == 0) {
    cartItem.textContent = "Il n'y a aucun produit dans le panier";
    return true;
  }
}

// Afficher les produits sur le DOM
async function displayProduct(productLS) {
  if (productLS.length > 0) {
    for (let item of productLS) {
      fetch(`http://localhost:3000/api/products/${item.id}`)
        .then((data) => data.json())
        .then((product) => {
          // Création article
          const article = document.createElement("article");
          article.setAttribute("class", "cart__item");
          article.setAttribute("data-id", `${item.id}`);
          article.setAttribute("data-color", `${item.color}`);

          // Création container img + img
          const cartItemImg = document.createElement("div");
          cartItemImg.setAttribute("class", "cart__item__img");
          const img = document.createElement("img");
          img.setAttribute("src", `${item.imageUrl}`);
          img.setAttribute("alt", `${product.altTxt}`);

          // Création du container content + content
          const cartItemContent = document.createElement("div");
          cartItemContent.setAttribute("class", "cart__item__content");
          const cartItemContentDescription = document.createElement("div");
          cartItemContentDescription.setAttribute(
            "class",
            "cart__item__content__description"
          );
          const h2Description = document.createElement("h2");
          h2Description.textContent = `${item.name}`;
          h2Description.setAttribute("class", "name");
          const pColor = document.createElement("p");
          pColor.textContent = `${item.color}`;
          pColor.setAttribute("class", "color");
          const pPrice = document.createElement("p");
          pPrice.textContent = `${product.price} €`;
          pPrice.setAttribute("class", "price");

          // Content settings
          const cartItemContentSettings = document.createElement("div");
          cartItemContentSettings.setAttribute(
            "class",
            "cart__item__content__settings"
          );
          const cartItemContentSettingsQuantity = document.createElement("div");
          cartItemContentSettingsQuantity.setAttribute(
            "class",
            "cart__item__content__settings__quantity"
          );
          const contentSettingsP = document.createElement("p");
          contentSettingsP.textContent = "Qté : ";
          const inputQuantity = document.createElement("input");
          inputQuantity.setAttribute("type", "number");
          inputQuantity.setAttribute("class", "itemQuantity");
          inputQuantity.setAttribute("name", "itemQuantity");
          inputQuantity.setAttribute("min", "1");
          inputQuantity.setAttribute("max", "100");
          inputQuantity.setAttribute("value", `${item.quantity}`);

          // delete container + delete
          const deleteContainer = document.createElement("div");
          deleteContainer.setAttribute(
            "class",
            "cart__item__content__settings__delete"
          );
          const pDelete = document.createElement("p");
          pDelete.setAttribute("class", "deleteItem");
          pDelete.textContent = "Supprimer";

          cartItem.appendChild(article);
          article.appendChild(cartItemImg);
          article.appendChild(cartItemContent);
          cartItemImg.appendChild(img);
          cartItemContent.appendChild(cartItemContentDescription);
          cartItemContent.appendChild(cartItemContentSettings);
          cartItemContentDescription.appendChild(h2Description);
          cartItemContentDescription.appendChild(pColor);
          cartItemContentDescription.appendChild(pPrice);
          cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);
          cartItemContentSettings.appendChild(deleteContainer);
          cartItemContentSettingsQuantity.appendChild(contentSettingsP);
          cartItemContentSettingsQuantity.appendChild(inputQuantity);
          deleteContainer.appendChild(pDelete);

          totalPrice();
          totalQuantity();
          changeQuantity(product, productLS);
          deleteItem(product);
          checkProductLS();
        })
        .catch(() =>
          alert(
            "Il y a un problème avec le serveur, merci de réessayer plus tard"
          )
        );
    }
  }
}

// Récupérer le prix total de l'ensemble des produits du panier
async function totalPrice() {
  let kanap = await getProductLS();
  let quantities = document.querySelectorAll(".itemQuantity");
  let prices = document.querySelectorAll(".cart__item__content__description");
  let cartPrice = 0;
  for (let i = 0; i < prices.length; i++) {
    cartPrice +=
      parseInt(prices[i].lastElementChild.textContent) * quantities[i].value;
  }
  document.getElementById("totalPrice").textContent = cartPrice;
  saveProductLS(kanap);
}

// Afficher la quantité total de produit
async function totalQuantity() {
  let kanap = await getProductLS();
  let total = 0;
  for (const item of kanap) {
    total += parseInt(item.quantity);
  }
  const tQuantity = document.querySelector("#totalQuantity");
  tQuantity.textContent = total;
  saveProductLS(kanap);
}

// Change la quantité depuis la page panier
async function changeQuantity(product, productLS) {
  let kanap = await getProductLS();
  let inputQuantity = document.querySelectorAll(".itemQuantity");

  inputQuantity.forEach((item) => {
    item.addEventListener("input", (e) => {
      const target = e.target.closest(".cart__item").dataset.id;
      const color = e.target.closest(".cart__item").dataset.color;
      let kanapFind = kanap.find((item) => {
        return item.id == target && item.color == color;
      });
      kanapFind.quantity = parseInt(e.target.value);
      saveProductLS(kanap);
      totalQuantity();
      totalPrice();
    });
  });
}

/************************************************************************************
 *                                         Classic Functions
 ***********************************************************************************/

// Récupérer les produits du localStorage
function getProductLS() {
  return JSON.parse(localStorage.getItem("product"));
}

// Supprimer un élément du LS
function deleteItem(product) {
  const deleteButtons = document.querySelectorAll(".deleteItem");

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const target = e.target.closest(".cart__item").dataset.id;
      const color = e.target.closest(".cart__item").dataset.color;
      const deleteItem = e.target.closest(".cart__item");
      let kanap = await getProductLS();
      kanap = kanap.filter((item) => {
        return item.id != target || item.color != color;
      });
      deleteItem.remove();
      saveProductLS(kanap);
      totalQuantity();
      totalPrice();
      checkProductLS();
    });
  });
}

// Sauvegarder dans le localStorage
function saveProductLS(product) {
  return localStorage.setItem("product", JSON.stringify(product));
}

// Affichage des erreurs
function displayError(input, ErrorMsg, regex, type, requis) {
  ErrorMsg = document.querySelector(`#${ErrorMsg}`);
  ErrorMsg.style.margin = "0.25rem 0";
  ErrorMsg.style.padding = "0.25rem";
  ErrorMsg.style.display = "none";

  if (input == 0) {
    ErrorMsg.textContent = `Merci de renseigner ${type}`;
    ErrorMsg.style.display = "block";
  } else if (!regex.test(input)) {
    ErrorMsg.textContent = `Merci de renseigner ${type} valide et ${requis}`;
    ErrorMsg.style.display = "block";
  } else if (regex.test(input)) {
    ErrorMsg.textContent = "";
    ErrorMsg.style.display = "none";
  }
}

// checker les champs du formulaire grâce au regex
function check() {
  const firstname = document.getElementById("firstName").value;
  const lastname = document.getElementById("lastName").value;
  const address = document.getElementById("address").value;
  const email = document.getElementById("email").value;
  const city = document.getElementById("city").value;
  if (
    !(
      regexFirstName.test(firstname) &&
      regexLastName.test(lastname) &&
      regexEmail.test(email) &&
      regexCity.test(city) &&
      address.length > 6
    )
  ) {
    return false;
  } else {
    return true;
  }
}

// Confirmer le panier
function confirmCart() {
  const productLS = getProductLS();
  // Nouveau tableau uniquement avec les id
  const newProduct = productLS.map((item) => {
    return item.id;
  });
  const order = {
    contact: {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      email: document.getElementById("email").value,
      city: document.getElementById("city").value,
    },
    products: newProduct,
  };

  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(order),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      location.href = `confirmation.html?id=${data.orderId}`;
    })
    .catch(() =>
      alert("Il y a un problème avec le serveur, merci de réessayer plus tard")
    );
}