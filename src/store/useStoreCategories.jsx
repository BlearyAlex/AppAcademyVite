import { create } from "zustand";
import axios from "axios";

const useStoreCategory = create((set) => ({
    categories: [],
    category: null,
    loading: false,
    erro: null,

    createCategory: async (newCategory) => {
        set({ loading: true, error: null })
        try {
            const response = await axios.post('http://localhost:8080/api/v1/Categoria/CreateCategoria')
            set((state) => ({
                categories: [...state.categories, response.data]
            }));
            return response.data;
        } catch (error) {
            console.error("Error creando la categoria:", error);
            set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    // Actualizar 
    updateCategory: async (category) => {
        try {
            const { id } = category;
            const response = await axios.put(`http://localhost:8080/api/v1/Categoria/UpdateCategoria/${id}`, category);
            set({ category: response.data, loading: false });
        } catch (error) {
            console.error("Error actualizando la categoria:", error);
            set({ error: error.message, loading: false });
        }
    },

    // Eliminar 
    deleteCategory: async (categoryId) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`http://localhost:8080/api/v1/Categoria/DeleteCategoria/${categoryId}`);
            set((state) => ({
                categories: state.productos.filter((category) => category.id !== categoryId)
            }));
        } catch (error) {
            console.error("Error eliminando la categoria:", error);
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    // Obtener todos 
    fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('http://localhost:8080/api/v1/Categoria/GetAllCategorias');
            set({ categories: response.data, loading: false });
        } catch (error) {
            console.error("Error obteniendo las categorias:", error);
            set({ error: error.message, loading: false });
        }
    },

    // Obtener por Id
    fetchCategoryById: async (categoryId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/Categoria/GetCategoriaById/${categoryId}`)
            set({ category: response.data, loading: false });
            console.log(response)
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    }
}))

export default useStoreCategory