import { create } from "zustand";
import axios from "axios";

const useStore = create(set => ({
    products: [],
    loading: false,
    error: null,
    fetchProducts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("http://localhost:8080/api/v1/Producto/GetAllProductos");
            set({ products: response.data, loading: false })
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    }
}))

export default useStore