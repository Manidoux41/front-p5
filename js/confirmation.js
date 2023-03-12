confirmation();


/************************************************************************************
 *                                         Classic Functions
 ***********************************************************************************/

// Récupère l'ID du produit et l'injecte dans le DOM
function confirmation() {
    const orderId = document.querySelector("#orderId");
    const orderIdUrl = new URL(location.href).searchParams.get("id");
    orderId.textContent = orderIdUrl;
  
    //Suppression des produits du localStorage et du panier lorsque la commande est passée
    localStorage.removeItem("product");
}
