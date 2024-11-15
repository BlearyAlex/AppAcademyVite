import { create } from 'zustand';
import axios from 'axios';

const useStoreProduct = create((set) => ({
    productos: [],
    producto: null,
    nombreProducto: '',
    setNombreProducto: (nombre) => set({ nombreProducto: nombre }),
    loading: false,
    fetchError: null,
    deleteError: null,

    // Crear producto
    createProducto: async (newProducto) => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.post('http://localhost:8080/api/v1/Producto/CreateProduct', newProducto, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            set((state) => ({
                productos: [...state.productos, response.data]
            }));
            return response.data;
        } catch (error) {
            console.error("Error creando el producto:", error);
            set({ fetchError: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    // Actualizar producto
    updateProducto: async (producto) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/v1/Producto/UpdateProduct`, producto);
            set({ producto: response.data, loading: false });
        } catch (error) {
            console.error("Error actualizando el producto:", error);
            set({ fetchError: error.message, loading: false });
        }
    },

    // Eliminar producto
    deleteProduct: async (productId) => {
        set({ loading: true, fetchError: null });
        try {
            await axios.delete(`http://localhost:8080/api/v1/Producto/DeleteProduct/${productId}`);
            set((state) => ({
                productos: state.productos.filter((producto) => producto.id !== productId)
            }));
        } catch (error) {

            const errorMessage = error.response?.data?.message || 'No se pudo eliminar el producto.';
            set({ deleteError: error.message });
            throw new Error(errorMessage);
        } finally {
            set({ loading: false });
        }
    },

    // Obtener todos los productos
    fetchProducts: async () => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get('http://localhost:8080/api/v1/Producto/GetAllProductos');
            set({ productos: response.data, loading: false });
        } catch (error) {
            console.error("Error obteniendo los productos:", error);
            set({ fetchError: error.message, loading: false });
        }
    },

    fetchProductById: async (productId) => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/Producto/GetProductoById/${productId}`)
            set({ producto: response.data });
            console.log(response)
        } catch (error) {
            set({ fetchError: error.message, loading: false });
        } finally {
            set({ loading: false })
        }
    },
}));

export default useStoreProduct;
