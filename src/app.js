import express from 'express';
import handlebars from 'express-handlebars';
import { Server, Socket } from 'socket.io';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.products.routes.js';
import productManager from './ProductManager.js';

const PORT = 8080;
const app = express();

// Express
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

// Se declara
app.engine('handlebars', handlebars.engine());
// Se configura un motor con un nombre
app.set('views', 'src/views');
// Se especifica cual se usará
app.set('view engine', 'handlebars');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on('connect', async socket => {
    console.log('New client connected');

    // Escuchar cuando se agregar un producto
    socket.on("newProduct", async (data) => {
        try {
            // const product = await productManager.addProduct(data);
            await productManager.addProduct(data);
            const products = await productManager.getProducts()
            // socketServer.emit('products', products);
            socketServer.emit("products_received", products);
        } catch (error) {
            console.log('Error desde socket.on("product_send", async (data)', error); 
        }
    });

    socket.on("deleteProduct", async data => {
        try {
            const id = await data;
            await productManager.deleteProduct(+id);
            const products = await productManager.getProducts();
            // socketServer.emit('products', products);
            socketServer.emit("products_received", products);
        } catch (error) {
            console.log(error);  
        }
    })

    // Escuchar cuando se elimina un producto
    const products = await productManager.getProducts();
    socketServer.emit("products_received", products);
    // socket.broadcast.emit('updatedProducts', products);
})


