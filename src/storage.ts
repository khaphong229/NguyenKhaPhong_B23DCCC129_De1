import { initBooks } from "./mock";
import { Book } from "./types/book";
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = "LIBRARY_BOOKS";

export const getBooks = async (): Promise<Book[]> => {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json != null) {
            const data = JSON.parse(json);
            console.log('load books:', data.length);
            return data;
        }
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initBooks));
        return initBooks;
    } catch (err) {
        console.log('err getBooks:', err);
        return initBooks;
    }
};

export const saveBooks = async (list: Book[]): Promise<void> => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
        console.log('err saveBooks:', err);
    }
};