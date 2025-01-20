import { create } from "zustand";
import axios from "axios";

const useAuthStore = create((set) => ({
    isAuthenticated: false, // Estado inicial de autenticación
    token: null,
    login: async (credentials) => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/User/login", credentials);
            const { token } = response.data;

            // Guardar token en el estado global 
            set({ token, isAuthenticated: true });

            // Guardar el token en el localStorage para persistencia
            localStorage.setItem('authToken', token);
        } catch (error) {
            console.log('Error al inciar sesion:', error);
            throw error;
        }
    },
    logout: () => {
        set({ token: null, isAuthenticated: false });
        localStorage.removeItem('authToken');
    },
    checkAuth: () => {
        const token = localStorage.getItem('authToken');
        set({ token, isAuthenticated: !!token });
    },
}));

export default useAuthStore;