import { create } from "zustand";
import axios from "axios";


const useStoreColegiatura = create((set) => ({
    colegiaturas: [],
    colegiatura: null,
    loading: false,
    fetchError: null,

    createColegiatura: async (newColegiatura) => {
        set({ loading: true, fetchError: null })
        try {
            const response = await axios.post('http://localhost:8080/api/v1/Colegiatura/CreateColegiatura', newColegiatura)
            set((state) => ({
                colegiaturas: [...state.colegiaturas, response.data]
            }));
            return response.data;
        } catch (error) {
            console.error("Error creando la colegiatura:", error);
            set({ fetchError: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    // Actualizar 
    updateColegiatura: async (colegiatura) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/v1/Colegiatura/UpdateColegiatura`, colegiatura);
            set({ colegiatura: response.data, loading: false });
        } catch (error) {
            console.error("Error actualizando la colegiatura:", error);
            set({ fetchError: error.message, loading: false });
        }
    },

    // Eliminar 
    deleteColegiatura: async (colegiaturaId) => {
        set({ loading: true, fetchError: null });
        try {
            await axios.delete(`http://localhost:8080/api/v1/Colegiatura/DeleteColegiatura/${colegiaturaId}`);
            set((state) => ({
                colegiaturas: state.colegiaturas.filter((colegiatura) => colegiatura.id !== colegiaturaId)
            }));
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'No se pudo eliminar la colegiatura.';
            set({ deleteError: error.message });
            throw new Error(errorMessage);
        } finally {
            set({ loading: false });
        }
    },

    // Obtener todos 
    fetchColegiaturas: async () => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get('http://localhost:8080/api/v1/Colegiatura/GetAllColegiaturas');
            set({ colegiaturas: response.data, loading: false });
        } catch (error) {
            console.error("Error obteniendo las colegiaturas:", error);
            set({ fetchError: error.message, loading: false });
        }
    },

    // Obtener por Id
    fetchColegiaturaById: async (colegiaturaId) => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/Colegiatura/GetColegiaturaById/${colegiaturaId}`)
            set({ colegiatura: response.data, loading: false });
            console.log(response)
        } catch (error) {
            set({ fetchError: error.message, loading: false });
        }
    }
}))

export default useStoreColegiatura