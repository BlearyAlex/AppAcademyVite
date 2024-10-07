import { create } from "zustand";
import axios from "axios";

const useStoreBrand = create((set) => ({
    brands: [],
    brand: null,
    loading: false,
    fetchError: null,
    deleteError: null,

    createBrand: async (newBrand) => {
        set({ loading: true, fetchError: null })
        try {
            const response = await axios.post('http://localhost:8080/api/v1/Marca/CreateMarca', newBrand)
            set((state) => ({
                brands: [...state.brands, response.data]
            }));
            return response.data;
        } catch (error) {
            console.error("Error creando la marca:", error);
            set({ fetchError: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    // Actualizar 
    updateBrand: async (brand) => {
        try {
            const response = await axios.put('http://localhost:8080/api/v1/Marca/UpdateMarca', brand);
            set({ brand: response.data, loading: false });
        } catch (error) {
            console.error("Error actualizando la marca:", error);
            set({ fetchError: error.message, loading: false });
        }
    },

    // Eliminar 
    deleteBrand: async (brandId) => {
        set({ loading: true, fetchError: null });
        try {
            await axios.delete(`http://localhost:8080/api/v1/Marca/DeleteMarca/${brandId}`);
            set((state) => ({
                productos: state.productos.filter((brand) => brand.id !== brandId)
            }));
        } catch (error) {
            console.error("Error eliminando la marca:", error);
            set({ deleteError: error.message });
        } finally {
            set({ loading: false });
        }
    },

    // Obtener todos 
    fetchBrands: async () => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get('http://localhost:8080/api/v1/Marca/GetAllMarcas');
            set({ brands: response.data, loading: false });
        } catch (error) {
            console.error("Error obteniendo las marcas:", error);
            set({ fetchError: error.message, loading: false });
        }
    },

    // Obtener por Id
    fetchBrandById: async (brandId) => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/Marca/GetMarcaById/${brandId}`)
            set({ brand: response.data, loading: false });
            console.log(response)
        } catch (error) {
            set({ fetchError: error.message, loading: false });
        }
    }
}))

export default useStoreBrand;