import { create } from "zustand";
import axios from "axios";

const useStoreCategory = create((set) => ({
    categories: [],
    category: null,
    loading: false,
    fetchError: null,

    createCategory: async (newCategory) => {
        set({ loading: true, fetchError: null })
        try {
            const response = await axios.post('http://localhost:8080/api/v1/Categoria/CreateCategoria', newCategory)
            set((state) => ({
                categories: [...state.categories, response.data]
            }));
            return response.data;
        } catch (error) {
            console.error("Error creando la categoria:", error);
            set({ fetchError: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    // Actualizar 
    updateCategory: async (category) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/v1/Categoria/UpdateCategoria`, category);
            set({ category: response.data, loading: false });
        } catch (error) {
            console.error("Error actualizando la categoria:", error);
            set({ fetchError: error.message, loading: false });
        }
    },

    // Eliminar 
    deleteCategory: async (categoriaId) => {
        set({ loading: true, fetchError: null });
        try {
            await axios.delete(`http://localhost:8080/api/v1/Categoria/DeleteCategoria/${categoriaId}`);
            set((state) => ({
                categories: state.productos.filter((category) => category.id !== categoriaId)
            }));
        } catch (error) {
            console.error("Error eliminando la categoria:", error);
            set({ fetchError: error.message });
        } finally {
            set({ loading: false });
        }
    },

    // Obtener todos 
    fetchCategories: async () => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get('http://localhost:8080/api/v1/Categoria/GetAllCategorias');
            set({ categories: response.data, loading: false });
        } catch (error) {
            console.error("Error obteniendo las categorias:", error);
            set({ fetchError: error.message, loading: false });
        }
    },

    // Obtener por Id
    fetchCategoryById: async (categoriaId) => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/Categoria/GetCategoriaById/${categoriaId}`)
            set({ category: response.data, loading: false });
            console.log(response)
        } catch (error) {
            set({ fetchError: error.message, loading: false });
        }
    }
}))

export default useStoreCategory