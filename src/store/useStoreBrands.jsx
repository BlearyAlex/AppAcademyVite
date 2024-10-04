import { create } from "zustand";
import axios from "axios";

const useStoreBrand = create((set) => ({
    brands: [],
    brand: null,
    loading: false,
    error: null,

    createBrand: async (newBrand) => {
        set({ loading: true, error: null })
        try {
            const response = await axios.post('http://localhost:8080/api/v1/Marca/CreateMarca')
            set((state) => ({
                brands: [...state.brands, response.data]
            }));
            return response.data;
        } catch (error) {
            console.error("Error creando la marca:", error);
            set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    // Actualizar 
    updateBrand: async (brand) => {
        try {
            const { id } = brand;
            const response = await axios.put(`http://localhost:8080/api/v1/Marca/UpdateMarca/${id}`, brand);
            set({ brand: response.data, loading: false });
        } catch (error) {
            console.error("Error actualizando la marca:", error);
            set({ error: error.message, loading: false });
        }
    },

    // Eliminar 
    deleteBrand: async (brandId) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`http://localhost:8080/api/v1/Marca/DeleteMarca/${brandId}`);
            set((state) => ({
                productos: state.productos.filter((brand) => brand.id !== brandId)
            }));
        } catch (error) {
            console.error("Error eliminando la marca:", error);
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    // Obtener todos 
    fetchBrands: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('http://localhost:8080/api/v1/Marca/GetAllMarcas');
            set({ brands: response.data, loading: false });
        } catch (error) {
            console.error("Error obteniendo las marcas:", error);
            set({ error: error.message, loading: false });
        }
    },

    // Obtener por Id
    fetchBrandById: async (brandId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/Marca/GetBrandById/${brandId}`)
            set({ brand: response.data, loading: false });
            console.log(response)
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    }
}))

export default useStoreBrand;