import { create } from "zustand";
import axios from "axios";

const useStoreStudent = create((set) => ({
    students: [],
    student: null,
    loading: false,
    fetchError: null,

    createStudent: async (newStudent) => {
        set({ loading: true, fetchError: null })
        try {
            const response = await axios.post('http://localhost:8080/api/v1/Estudiante/CreateEstudiante', newStudent)
            set((state) => ({
                students: [...state.students, response.data]
            }));
            return response.data;
        } catch (error) {
            console.error("Error creando el estudiante:", error);
            set({ fetchError: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    // Actualizar 
    updateStudent: async (student) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/v1/Estudiante/UpdateEstudiante`, student);
            set({ student: response.data, loading: false });
        } catch (error) {
            console.error("Error actualizando el estudiante:", error);
            set({ fetchError: error.message, loading: false });
        }
    },

    // Eliminar 
    deleteStudent: async (studentId) => {
        set({ loading: true, fetchError: null });
        try {
            await axios.delete(`http://localhost:8080/api/v1/Estudiante/DeleteEstudiante/${studentId}`);
            set((state) => ({
                students: state.students.filter((student) => student.id !== studentId)
            }));
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'No se pudo eliminar el estudiante.';
            set({ deleteError: error.message });
            throw new Error(errorMessage);
        } finally {
            set({ loading: false });
        }
    },

    // Obtener todos 
    fetchStudents: async () => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get('http://localhost:8080/api/v1/Estudiante/GetAllEstudiantes');
            set({ students: response.data, loading: false });
        } catch (error) {
            console.error("Error obteniendo los estudiantes:", error);
            set({ fetchError: error.message, loading: false });
        }
    },

    // Obtener por Id
    fetchStudentById: async (studentId) => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/Estudiante/GetEstudianteById/${studentId}`)
            set({ student: response.data, loading: false });
            console.log(response)
        } catch (error) {
            set({ fetchError: error.message, loading: false });
        }
    },

    fetchStudentWithColegiaturas: async (studentId) => {
        set({ loading: true, fetchError: null });
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/Estudiante/GetEstudianteWithColegiatura/${studentId}`)
            set({ student: response.data, loading: false });
            console.log(response)
        } catch (error) {
            set({ fetchError: error.message, loading: false })
        }
    }
}))

export default useStoreStudent