// store.js
import { create } from 'zustand';
import axios from 'axios';

const useStoreProduct = create((set) => ({
    productos: [],
    producto: null,
    loading: false,
    error: null,

    // Crear producto
    createProducto: async (newProducto) => {
        set({ loading: true, error: null }); // Asegurarte de que loading esté en true mientras se hace la solicitud
        try {
            const response = await axios.post('http://localhost:8080/api/v1/Producto/CreateProduct', newProducto);
            set((state) => ({
                productos: [...state.productos, response.data]
            }));
            return response.data; // Devolver el producto creado
        } catch (error) {
            console.error("Error creando el producto:", error);
            set({ error: error.message });
            throw error; // Re-lanzar el error para manejarlo en el componente
        } finally {
            set({ loading: false }); // Asegurar que loading se ponga en false al final
        }
    },

    // Actualizar producto
    updateProducto: async (producto) => {
        try {
            const { id } = producto;
            const response = await axios.put(`http://localhost:8080/api/v1/Producto/UpdateProduct/${id}`, producto);
            set({ producto: response.data, loading: false });
        } catch (error) {
            console.error("Error actualizando el producto:", error);
            set({ error: error.message, loading: false });
        }
    },

    // Eliminar producto
    deleteProduct: async (productId) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`http://localhost:8080/api/v1/Producto/DeleteProduct/${productId}`);
            set((state) => ({
                productos: state.productos.filter((producto) => producto.id !== productId)
            }));
        } catch (error) {
            console.error("Error eliminando el producto:", error);
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    // Obtener todos los productos
    fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('http://localhost:8080/api/v1/Producto/GetAllProductos');
            set({ productos: response.data, loading: false });
        } catch (error) {
            console.error("Error obteniendo los productos:", error);
            set({ error: error.message, loading: false });
        }
    },

    fetchProductById: async (productId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/Producto/GetProductoById/${productId}`)
            set({ producto: response.data, loading: false });
            console.log(response)
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    }
}));

export default useStoreProduct;
