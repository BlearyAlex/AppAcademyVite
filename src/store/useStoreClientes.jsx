import { create } from "zustand";
import axios from "axios";

const useStoreCliente = create((set) => ({
    clientes: [],
    cliente: "",
    loading: false,
    fetchError: null,

    createCliente: async (newCliente) => {
        set({ loading: true, fetchError: null })
        try {
            const response = await axios.post('http://localhost:8080/api/v1/Cliente/CreateClient', newCliente)
            set((state) => ({
                clientes: [...state.clientes, response.data]
            }));
            return response.data;
        } catch (error) {
            console.error("Error creando el cliente:", error);
            set({ fetchError: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    // Actualizar 
    updateCliente: async (cliente) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/v1/Cliente/UpdateClient`, cliente);
            console.log("Código de respuesta:", response.status);
            set({ cliente: response.data, loading: false });
        } catch (error) {
            console.error("Error actualizando el cliente:", error);
            set({ fetchError: error.message, loading: false });
        }
    },

    // Eliminar 
    deleteCliente: async (clienteId) => {
        set({ loading: true, fetchError: null });
        try {
            await axios.delete(`http://localhost:8080/api/v1/Cliente/DeleteClient/${clienteId}`);
            set((state) => ({
                clientes: state.clientes.filter((cliente) => cliente.id !== clienteId)
            }));
        } catch (error) {

            const errorMessage = error.response?.data?.message || 'No se pudo eliminar el cliente.';
            set({ deleteError: error.message });
            throw new Error(errorMessage);
        } finally {
            set({ loading: false });
        }
    },

    // Obtener todos 
    fetchClientes: async () => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get('http://localhost:8080/api/v1/Cliente/GetAllClients');
            set({ clientes: response.data, loading: false });
        } catch (error) {
            console.error("Error obteniendo los clientes:", error);
            set({ fetchError: error.message, loading: false });
        }
    },

    // Obtener por Id
    fetchClienteById: async (clienteId) => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/Cliente/GetClientById/${clienteId}`)
            set({ cliente: response.data, loading: false });
            console.log(response)
        } catch (error) {
            set({ fetchError: error.message, loading: false });
        }
    }
}))

export default useStoreCliente