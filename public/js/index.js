const socket = io();

const form = document.getElementById('form');
const container = document.getElementById('container'); 

form.addEventListener('submit', (event) => {
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
    socket.emit("client:addProduct", product);
    form.reset();
})

socket.on("server:renderProducts", data => {
    // console.log(data);
    let products = ''
    data.forEach(product => {
        // console.log(product);
        // console.log(product.id, product.thumbnail[0]);
        products +=`<div class="product__card">
        <h3>Id: ${product?.id}</h3>
        <h4>Title: ${product?.title}</h4>
        <p>Description: ${product?.description}</p>
        <p>Price: ${product?.price}</p>
        <p>Code: ${product?.code}</p>
        <p>Stock: ${product?.stock}</p>
        <p>Available: ${product?.available}</p>
        <img height="240px" width="auto" src=${product?.thumbnail[0]} alt=${product?.title} draggable="false">
        <button class="deleteButton" data-id="${product?.id}">Delete</button>
    </div>`
    })
    container.innerHTML = products;
    const deleteButtons = document.querySelectorAll('.deleteButton');
    deleteButtons.forEach((button) => {
        const pid = button.dataset.id;
        button.addEventListener("click", () => {
                socket.emit('client:deleteProduct', +pid);
        });
    });
});


