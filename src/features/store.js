import { create } from "zustand";
import { persist } from 'zustand/middleware';

const itemExists = (array, id) => array.some(item => item.id === id);
const USERS_STORAGE_KEY = 'registeredUsers';

const getStoredUsers = () => {
    try {
        const users = localStorage.getItem(USERS_STORAGE_KEY);
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error("Failed to parse users from localStorage", error);
        return [];
    }
};

const setStoredUsers = (users) => {
    try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
        console.error("Failed to save users to localStorage", error);
    }
};

export const useStore = create(
    persist(
        (set, get) => ({
            cart: [],
            favorites: [],
            isAuthenticated: false,
            currentUser: null,
            searchTerm: '',
            localReviews: {},

            setSearchTerm: (term) => set({ searchTerm: term }),

            addToCart: (product) =>
                set((state) => {
                    if (itemExists(state.cart, product.id)) {
                        return {};
                    }
                    return { cart: [...state.cart, product] };
                }),

            removeFromCart: (productId) =>
                set((state) => ({
                    cart: state.cart.filter((item) => item.id !== productId),
                })),

            toggleFavorite: (product) =>
                set((state) => {
                    const exists = itemExists(state.favorites, product.id);
                    if (exists) {
                        return { favorites: state.favorites.filter((item) => item.id !== product.id) };
                    } else {
                        return { favorites: [...state.favorites, product] };
                    }
                }),

            removeFromFavorites: (productId) =>
                set((state) => ({
                    favorites: state.favorites.filter((item) => item.id !== productId),
                })),

            clearCart: () => set({ cart: [] }),

            login: (credentials) => {
                const users = getStoredUsers();
                const user = users.find(u => u.email === credentials.email);
                if (user && user.password === credentials.password) {
                    set({ isAuthenticated: true, currentUser: { ...user, avatarUrl: user.avatarUrl || null } });
                    return { success: true, user };
                } else {
                    return { success: false, message: 'Неверный email или пароль.' };
                }
            },

            logout: () => set({ isAuthenticated: false, currentUser: null, searchTerm: '' }),

            register: (userData) => {
                const users = getStoredUsers();
                if (users.some(u => u.email === userData.email)) {
                    return { success: false, message: 'Пользователь с таким email уже существует.' };
                }

                const newUser = { id: Date.now(), ...userData, password: userData.password, avatarUrl: null };
                const updatedUsers = [...users, newUser];
                setStoredUsers(updatedUsers);
                set({ isAuthenticated: true, currentUser: newUser });
                return { success: true, user: newUser };
            },

            updateProfile: (updatedData) => {
                const currentUser = get().currentUser;
                if (!currentUser) return { success: false, message: 'Пользователь не найден.' };
                const users = getStoredUsers();
                const userIndex = users.findIndex(u => u.id === currentUser.id);
                if (userIndex === -1) return { success: false, message: 'Пользователь не найден в хранилище.' };

                const dataToUpdate = { ...updatedData };
                if (updatedData.avatarUrl === undefined) {
                    delete dataToUpdate.avatarUrl;
                }

                const updatedUser = { ...users[userIndex], ...dataToUpdate };
                users[userIndex] = updatedUser;
                setStoredUsers(users);
                set({ currentUser: updatedUser });
                return { success: true, user: updatedUser };
            },

            updatePassword: ({ currentPassword, newPassword }) => {
                const currentUser = get().currentUser;
                if (!currentUser) return { success: false, message: 'Пользователь не найден.' };
                if (currentUser.password !== currentPassword) {
                    return { success: false, message: 'Текущий пароль неверен.'};
                }
                const users = getStoredUsers();
                const userIndex = users.findIndex(u => u.id === currentUser.id);
                if (userIndex === -1) return { success: false, message: 'Пользователь не найден в хранилище.' };
                const updatedUser = { ...users[userIndex], password: newPassword };
                users[userIndex] = updatedUser;
                setStoredUsers(users);
                set({ currentUser: updatedUser });
                return { success: true };
            },

            deleteAccount: () => {
                const currentUser = get().currentUser;
                if (!currentUser) return { success: false, message: 'Пользователь не найден.' };
                const users = getStoredUsers();
                const updatedUsers = users.filter(user => user.id !== currentUser.id);
                setStoredUsers(updatedUsers);
                set({ isAuthenticated: false, currentUser: null, cart: [], favorites: [] });
                return { success: true };
            },


            addReview: (productId, reviewData) => {
                const currentUser = get().currentUser;
                if (!currentUser) return { success: false, message: 'Нужно войти в систему для добавления отзыва.' };

                const newReview = {
                    ...reviewData,
                    id: `local-${Date.now()}`,
                    reviewerName: `${currentUser.firstName} ${currentUser.lastName}`,
                    userId: currentUser.id,
                    date: new Date().toISOString(),
                    isLocal: true
                };

                set((state) => ({
                    localReviews: {
                        ...state.localReviews,
                        [productId]: [...(state.localReviews[productId] || []), newReview],
                    },
                }));
                return { success: true };
            },

            updateReview: (productId, reviewId, updatedData) => {
                const currentUser = get().currentUser;
                if (!currentUser) return { success: false, message: 'Ошибка авторизации.' };

                set((state) => {
                    const productReviews = state.localReviews[productId];
                    if (!productReviews) return state;

                    const reviewIndex = productReviews.findIndex(r => r.id === reviewId && r.userId === currentUser.id && r.isLocal);
                    if (reviewIndex === -1) return state;

                    const updatedReviews = [...productReviews];
                    updatedReviews[reviewIndex] = {
                        ...updatedReviews[reviewIndex],
                        ...updatedData,
                        date: new Date().toISOString(),
                    };

                    return {
                        localReviews: {
                            ...state.localReviews,
                            [productId]: updatedReviews,
                        },
                    };
                });
                return { success: true };
            },

            deleteReview: (productId, reviewId) => {
                const currentUser = get().currentUser;
                if (!currentUser) return { success: false, message: 'Ошибка авторизации.' };

                set((state) => {
                    const productReviews = state.localReviews[productId];
                    if (!productReviews) return state; // No reviews for this product

                    const updatedReviews = productReviews.filter(r => !(r.id === reviewId && r.userId === currentUser.id && r.isLocal));


                    const newLocalReviews = { ...state.localReviews };
                    if (updatedReviews.length > 0) {
                        newLocalReviews[productId] = updatedReviews;
                    } else {
                        delete newLocalReviews[productId];
                    }

                    return { localReviews: newLocalReviews };
                });
                return { success: true };
            }

        }),
        {
            name: 'shopping-storage',
            partialize: (state) => ({
                cart: state.cart,
                favorites: state.favorites,
                isAuthenticated: state.isAuthenticated,
                currentUser: state.currentUser,
                localReviews: state.localReviews,
            }),
        }
    )
);

export const useIsFavorite = (productId) => {
    const favorites = useStore((state) => state.favorites);
    return itemExists(favorites, productId);
};