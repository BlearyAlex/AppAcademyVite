import { create } from "zustand";
import axios from "axios";

const useStoreProvider = create((set) => ({
    providers: [],
    provider: null,
    loading: false,
    fetchError: null,
    deleteError: null,

    createProvider: async (newProvider) => {
        set({ loading: true, fetchError: null })
        try {
            const response = await axios.post('http://localhost:8080/api/v1/Proveedor/CreateProveedor', newProvider)
            set((state) => ({
                providers: [...state.providers, response.data]
            }));
            return response.data;
        } catch (error) {
            console.error("Error creando el proveedor:", error);
            set({ fetchError: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    // Actualizar 
    updateProvider: async (provider) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/v1/Proveedor/UpdateProveedor`, provider);
            set({ provider: response.data, loading: false });
        } catch (error) {
            console.error("Error actualizando el proveedor:", error);
            set({ fetchError: error.message, loading: false });
        }
    },

    // Eliminar 
    deleteProvider: async (proveedorId) => {
        set({ loading: true, fetchError: null });
        try {
            await axios.delete(`http://localhost:8080/api/v1/Proveedor/DeleteProveedor/${proveedorId}`);
            set((state) => ({
                providers: state.providers.filter((provider) => provider.id !== proveedorId)
            }));
        } catch (error) {

            const errorMessage = error.response?.data?.message || 'No se pudo eliminar el proveedor.';
            set({ deleteError: error.message });
            throw new Error(errorMessage);
        } finally {
            set({ loading: false });
        }
    },

    // Obtener todos 
    fetchProviders: async () => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get('http://localhost:8080/api/v1/Proveedor/GetAllProveedores');
            set({ providers: response.data, loading: false });
        } catch (error) {
            console.error("Error obteniendo los proveedores:", error);
            set({ fetchError: error.message, loading: false });
        }
    },

    // Obtener por Id
    fetchProviderById: async (providerId) => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/Proveedor/GetProveedorById/${providerId}`)
            set({ provider: response.data, loading: false });
            console.log(response)
        } catch (error) {
            set({ fetchError: error.message, loading: false });
        }
    }
}))

export default useStoreProvider