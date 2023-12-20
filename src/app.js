import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
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

socketServer.on('connection', async socket => {
    console.log('New client connected', socket.id);
    // Escuchar cuando se agregar un producto
    socket.on("client:addProduct", async (data) => {
        try {
            await productManager.addProduct(data);
            const products = await productManager.getProducts()
            socketServer.emit("server:renderProducts", products);
        } catch (error) {
            console.log('Error desde socket.on("product_send", async (data)', error); 
        }
    });

    socket.on("client:deleteProduct", async data => {
        try {
            const id = await data;
            await productManager.deleteProduct(+id);
            const products = await productManager.getProducts();
            socketServer.emit("server:renderProducts", products);
        } catch (error) {
            console.log(error);  
        }
    })

    // Escuchar cuando se elimina un producto
    const products = await productManager.getProducts();
    socketServer.emit("server:renderProducts", products);
})


