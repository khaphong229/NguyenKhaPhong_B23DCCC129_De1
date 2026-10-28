import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getBooks, saveBooks } from '../storage';
import { colors } from '../colors';
import { Book, categories, RootStackParamList } from '../types/book';

type BookFormProps = NativeStackScreenProps<RootStackParamList, 'BookForm'>;

export default function BookForm({ navigation, route }: BookFormProps) {
  const editBook: Book | undefined = route.params?.book;

  const [title, setTitle] = useState<string>(editBook ? editBook.title : '');
  const [author, setAuthor] = useState<string>(editBook ? editBook.author : '');
  const [category, setCategory] = useState<string>(
    editBook ? editBook.category : categories[0],
  );
  const [year, setYear] = useState<string>(
    editBook ? String(editBook.year) : '',
  );
  const [quantity, setQuantity] = useState<string>(
    editBook ? String(editBook.quantity) : '',
  );

  const [errTitle, setErrTitle] = useState<string>('');
  const [errAuthor, setErrAuthor] = useState<string>('');
  const [errYear, setErrYear] = useState<string>('');
  const [errQty, setErrQty] = useState<string>('');

  const handleSave = async (): Promise<void> => {
    let valid: boolean = true;
    const currentYear: number = new Date().getFullYear();

    if (!title.trim()) {
      setErrTitle('Tên sách không được để trống');
      valid = false;
    } else {
      setErrTitle('');
    }

    if (!author.trim()) {
      setErrAuthor('Tác giả không được để trống');
      valid = false;
    } else {
      setErrAuthor('');
    }

    const y: number = Number(year.trim());
    if (
      !year.trim() ||
      isNaN(y) ||
      !Number.isInteger(y) ||
      y < 1900 ||
      y > currentYear
    ) {
      setErrYear(`Năm xuất bản phải từ 1900 đến ${currentYear}`);
      valid = false;
    } else {
      setErrYear('');
    }

    const q: number = Number(quantity.trim());
    if (!quantity.trim() || isNaN(q) || !Number.isInteger(q) || q <= 0) {
      setErrQty('Số lượng phải là số nguyên lớn hơn 0');
      valid = false;
    } else if (editBook && q < editBook.borrowed) {
      setErrQty(
        `Số lượng không được nhỏ hơn số cuốn đang mượn (${editBook.borrowed})`,
      );
      valid = false;
    } else {
      setErrQty('');
    }

    if (!valid) {
      return;
    }

    const list: Book[] = await getBooks();

    if (editBook) {
      const newList: Book[] = list.map((item: Book) => {
        if (item.id === editBook.id) {
          return {
            ...item,
            title: title.trim(),
            author: author.trim(),
            category: category,
            year: y,
            quantity: q,
          };
        }
        return item;
      });
      await saveBooks(newList);
      console.log('updated book:', editBook.id);
    } else {
      const newBook: Book = {
        id: Date.now().toString(),
        title: title.trim(),
        author: author.trim(),
        category: category,
        year: y,
        quantity: q,
        borrowed: 0,
      };
      const newList: Book[] = [...list, newBook];
      await saveBooks(newList);
      console.log('added book:', newBook.id);
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.label}>Tên sách *</Text>
          <TextInput
            style={[styles.input, errTitle ? styles.inputErr : null]}
            placeholder="Nhập tên sách"
            value={title}
            onChangeText={(val: string) => {
              setTitle(val);
              if (errTitle) {
                setErrTitle('');
              }
            }}
          />
          {errTitle ? <Text style={styles.errText}>{errTitle}</Text> : null}

          <Text style={styles.label}>Tác giả *</Text>
          <TextInput
            style={[styles.input, errAuthor ? styles.inputErr : null]}
            placeholder="Nhập tên tác giả"
            value={author}
            onChangeText={(val: string) => {
              setAuthor(val);
              if (errAuthor) {
                setErrAuthor('');
              }
            }}
          />
          {errAuthor ? <Text style={styles.errText}>{errAuthor}</Text> : null}

          <Text style={styles.label}>Thể loại</Text>
          <View style={styles.catRow}>
            {categories.map((c: string) => {
              const active: boolean = category === c;
              return (
                <TouchableOpacity
                  key={c}
                  style={[styles.catOption, active ? styles.catActive : null]}
                  onPress={() => setCategory(c)}>
                  <Text
                    style={[
                      styles.catOptionText,
                      active ? styles.catActiveText : null,
                    ]}>
                    {c}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Năm xuất bản *</Text>
          <TextInput
            style={[styles.input, errYear ? styles.inputErr : null]}
            placeholder="Ví dụ: 2023"
            keyboardType="numeric"
            value={year}
            onChangeText={(val: string) => {
              setYear(val);
              if (errYear) {
                setErrYear('');
              }
            }}
          />
          {errYear ? <Text style={styles.errText}>{errYear}</Text> : null}

          <Text style={styles.label}>Tổng số cuốn *</Text>
          <TextInput
            style={[styles.input, errQty ? styles.inputErr : null]}
            placeholder="Ví dụ: 5"
            keyboardType="numeric"
            value={quantity}
            onChangeText={(val: string) => {
              setQuantity(val);
              if (errQty) {
                setErrQty('');
              }
            }}
          />
          {errQty ? <Text style={styles.errText}>{errQty}</Text> : null}

          {editBook ? (
            <Text style={styles.noteText}>
              Số cuốn đang được mượn hiện tại: {editBook.borrowed}
            </Text>
          ) : null}

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>
              {editBook ? 'Cập nhật sách' : 'Thêm sách'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
  },
  inputErr: {
    borderColor: colors.red,
  },
  errText: {
    color: colors.red,
    fontSize: 13,
    marginTop: 4,
  },
  catRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  catOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginRight: 8,
    marginBottom: 8,
  },
  catActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  catOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  catActiveText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  noteText: {
    marginTop: 10,
    fontSize: 14,
    color: colors.subText,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 24,
  },
  saveBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
