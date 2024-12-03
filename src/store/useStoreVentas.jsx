import { create } from "zustand";
import axios from "axios";

const useStoreVenta = create((set) => ({
    ventas: [],
    venta: null,
    ventaForDate: null,
    ventaForMonth: null,
    ventaForDay: null,
    loading: false,
    fetchError: null,

    createVenta: async (newVenta) => {
        set({ loading: true, fetchError: null })
        try {
            const response = await axios.post('http://localhost:8080/api/v1/Venta/CreateVenta', newVenta)
            set((state) => ({
                ventas: [...state.ventas, response.data]
            }));
            return response.data;
        } catch (error) {
            set({ fetchError: error.message });
            throw error;
        } finally {
            set({ loading: false })
        }
    },

    // Actualizar 
    updateVenta: async (venta) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/v1/Venta/UpdateVenta`, venta);
            console.log("Código de respuesta:", response.status);
            set({ venta: response.data, loading: false });
        } catch (error) {
            console.error("Error actualizando venta:", error);
            set({ fetchError: error.message, loading: false });
        }
    },

    // Eliminar 
    deleteVenta: async (ventaId) => {
        set({ loading: true, fetchError: null });
        try {
            await axios.delete(`http://localhost:8080/api/v1/Venta/DeleteVenta/${ventaId}`);
            set((state) => ({
                ventas: state.ventas.filter((venta) => venta.id !== ventaId)
            }));
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'No se pudo eliminar la venta.';
            set({ deleteError: error.message });
            throw new Error(errorMessage);
        } finally {
            set({ loading: false });
        }
    },

    // Obtener todos 
    fetchVentas: async () => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get('http://localhost:8080/api/v1/Venta/GetAllVentas');
            set({ ventas: response.data, loading: false });
        } catch (error) {
            console.error("Error obteniendo las ventas:", error);
            set({ fetchError: error.message, loading: false });
        }
    },

    // Obtener por Id
    fetchVentaById: async (ventaId) => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/Venta/GetVentaById/${ventaId}`)
            set({ venta: response.data, loading: false });
            console.log(response)
        } catch (error) {
            set({ fetchError: error.message, loading: false });
        }
    },

    fetchVentasForDate: async (periodo) => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/Venta/GetVentasForDate?periodo=${periodo}`)
            set({ ventaForDate: response.data, loading: false });
            console.log(response)
        } catch (error) {
            set({ fetchError: error.message, loading: false })
        }
    },

    fetchVentasForMonth: async () => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get('http://localhost:8080/api/v1/Venta/GetVentasForMonth');
            set({ ventaForMonth: response.data, loading: false });
        } catch (error) {
            console.error("Error obteniendo las ventas:", error);
            set({ fetchError: error.message, loading: false });
        }
    },

    fetchVentasForDay: async () => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get('http://localhost:8080/api/v1/Venta/GetVentasForDay');
            set({ ventaForDay: response.data, loading: false });
        } catch (error) {
            console.error("Error obteniendo las ventas:", error);
            set({ fetchError: error.message, loading: false });
        }
    },
}))

export default useStoreVenta;