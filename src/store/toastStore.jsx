import { create } from "zustand";

export const useToastStore = create((set) => ({
    showToast: (message, type = 'success') => {
        set(() => ({
            toastMessage: message,
            toastType: type
        }));
    },
    toastMessage: '',
    toastType: 'success', // 'success', 'error', 'loading'
    clearToast: () => set({ toastMessage: '', toastType: 'success' }),
}));


export default useToastStore