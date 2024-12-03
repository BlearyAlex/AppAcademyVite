import { create } from "zustand";
import axios from "axios";

const useStoreEntrada = create((set) => ({
    entradas: [],
    entrada: null,
    loading: false,
    fetchError: false,
    deleteError: false,

    // Crear entrada
    CreateEntrada: async (newEntrada) => {
        set({ loading: true, fetchError: null })
        try {
            const response = await axios.post('http://localhost:8080/api/v1/Entrada/CreateEntrada', newEntrada);
            set((state) => ({
                entradas: [...state.entradas, response.data]
            }));
            return response.data;
        } catch (error) {
            console.log("Error creando la entrada:", error)
            set({ fetchError: error.message });
            throw error;
        } finally {
            set({ loading: false })
        }
    },

    // Actualizar entrada
    updateEntrada: async (entrada) => {
        try {
            const response = await axios.put('http://localhost:8080/api/v1/Entrada/UpdateEntrada', entrada);
            set({ entrada: response.data, loading: false });
        } catch (error) {
            console.error("Error actualizando la entrada:", error);
            set({ fetchError: error.message, loading: false });
        }
    },

    // Eliminar entrada
    deleteEntrada: async (entradaId) => {
        set({ loading: true, fetchError: null });
        try {
            await axios.delete(`http://localhost:8080/api/v1/Entrada/DeleteEntrada/${entradaId}`);
            set((state) => ({
                entradas: state.entradas.filter((entrada) => entrada.id !== entradaId)
            }));
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'No se pudo eliminar la entrada.';
            set({ deleteError: error.message });
            throw new Error(errorMessage);
        } finally {
            set({ loading: false });
        }
    },

    // Obtener todos las entradas
    fetchEntradas: async () => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get('http://localhost:8080/api/v1/Entrada/GetAllEntradas');
            set({ entradas: response.data, loading: false });
        } catch (error) {
            console.error("Error obteniendo las entradas:", error.message);
            set({ fetchError: error.message, loading: false });
        }
    },

    // Obtener por id 
    fetchEntradaById: async (entradaId) => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/Entrada/GetEntradaById/${entradaId}`)
            set({ entrada: response.data });
            console.log(response)
        } catch (error) {
            set({ fetchError: error.message, loading: false });
        } finally {
            set({ loading: false })
        }
    },

    fetchEntradaForMonth: async () => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get('http://localhost:8080/api/v1/Entrada/GetEntradaForMont');
            set({ entrada: response.data, loading: false });
        } catch (error) {
            console.error("Error obteniendo las entradas:", error.message);
            set({ fetchError: error.message, loading: false });
        }
    },
}))

export default useStoreEntrada;