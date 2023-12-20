import { Router } from "express";
import productManager from "../ProductManager.js";

const viewsRouter = Router();

// app.get('/', (req, res) => {
//     res.render('home')
// })
viewsRouter.get('/', async (req, res) => {
    try {
        // const {data : products} = await axios.get('http://localhost:8080/api/products/');
        const products = await productManager.getProducts();
        res.render('home', { products, title: 'Products', style: 'index.css' });
    } catch (error) {
        res.send('error');
    }
})

viewsRouter.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        // console.log('Hola desde /realTimeProducts y views.products.roustes.js');
        res.render('realTimeProducts', { products, title: 'RealTimeProducts', style: 'index.css' });
    } catch (error) {
        res.send('error');
    }
})

export default viewsRouter;
