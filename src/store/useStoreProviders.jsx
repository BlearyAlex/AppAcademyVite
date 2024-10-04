import { create } from "zustand";
import axios from "axios";

const useStoreProvider = create((set) => ({
    providers: [],
    provider: null,
    loading: false,
    erro: null,

    createProvider: async (newProvider) => {
        set({ loading: true, error: null })
        try {
            const response = await axios.post('http://localhost:8080/api/v1/Proveedor/GetAllProveedores')
            set((state) => ({
                providers: [...state.providers, response.data]
            }));
            return response.data;
        } catch (error) {
            console.error("Error creando el proveedor:", error);
            set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    // Actualizar 
    updateProvider: async (provider) => {
        try {
            const { id } = provider;
            const response = await axios.put(`http://localhost:8080/api/v1/Proveedor/UpdateProveedor/${id}`, provider);
            set({ provider: response.data, loading: false });
        } catch (error) {
            console.error("Error actualizando el proveedor:", error);
            set({ error: error.message, loading: false });
        }
    },

    // Eliminar 
    deleteProvider: async (providerId) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`http://localhost:8080/api/v1/Proveedor/DeleteProveedor/${providerId}`);
            set((state) => ({
                providers: state.providers.filter((provider) => provider.id !== providerId)
            }));
        } catch (error) {
            console.error("Error eliminando el proveedor:", error);
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    // Obtener todos 
    fetchProviders: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('http://localhost:8080/api/v1/Proveedor/GetAllProveedores');
            set({ providers: response.data, loading: false });
        } catch (error) {
            console.error("Error obteniendo los proveedores:", error);
            set({ error: error.message, loading: false });
        }
    },

    // Obtener por Id
    fetchProviderById: async (providerId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/Proveedor/GetProveedorById/${providerId}`)
            set({ provider: response.data, loading: false });
            console.log(response)
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    }
}))

export default useStoreProvider