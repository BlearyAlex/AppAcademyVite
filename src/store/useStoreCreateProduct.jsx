// store.js
import { create } from 'zustand';
import axios from 'axios';

const useStoreCreateProduct = create((set) => ({
    productos: [],
    crearProducto: async (producto) => {
        try {
            const response = await axios.post('http://localhost:8080/api/v1/Producto/CreateProduct', producto);
            set((state) => ({
                productos: [...state.productos, response.data]
            }));
            return response.data;
        } catch (error) {
            console.error("Error creando el producto:", error);
            throw error; // Re-lanzar el error para manejarlo en el componente
        }
    }
}));

export default useStoreCreateProduct;
