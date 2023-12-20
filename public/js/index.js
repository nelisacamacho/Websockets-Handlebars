const socket = io();

const form = document.getElementById('form');
// const submit = document.getElementById('sumbit');
const container = document.getElementById('container'); 

form.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(form);
    const product = {
        title: formData.get('title'),
        description: formData.get('description'),
        price: formData.get('price'),
        thumbnail: formData.get('thumbnail'),
        code: formData.get('code'),
        stock: formData.get('stock'),
    };
    socket.emit("newProduct", product);
    form.reset();
})

// socket.on("products", async data => {
//     const products = await data;
//     console.log('prodcusts reveived desde index product[0]', products[0]);
// })

socket.on("products_received", data => {
    let products = ''
    data.forEach(product => {
        products +=`<div class="product__card">
        <h3>Id: ${product.id}</h3>
        <h4>Title: ${product.title}</h4>
        <p>Description: ${product.description}</p>
        <p>Price: ${product.price}</p>
        <p>Code: ${product.code}</p>
        <p>Stock: ${product.stock}</p>
        <p>Available: ${product.available}</p>
            <img height="300px" width="auto" src=${product.thumbnail} alt="">
    </div>`
    })
    container.innerHTML = products;
})


