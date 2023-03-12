dataFetch();


/************************************************************************************
 *                                         Async Functions
 ***********************************************************************************/
async function dataFetch() {
  let url = 'http://localhost:3000/api/products';

 await fetch(url)
 .then(response => response.json())
 .then((products) => {
   console.log(products);

   for(let data of products) {     
        // displayProducts();
       let display = ''
       display += `<a href="./product.html?id=${data._id}">
                       <article>
                           <img src=${data.imageUrl} alt="${data.altTxt}">
                           <h3 class="productName">${data.name}</h3>
                           <p class="productDescription">${data.description}</p>
                       </article>
                   </a>`
       document.getElementById('items').insertAdjacentHTML("beforeend", display)
   }
})
 .catch((err) => console.log('server unavailable:' + err));
}