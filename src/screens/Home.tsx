import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getBooks, saveBooks } from '../storage';
import { colors } from '../colors';
import BookItem from '../components/BookItem';
import { Book, categories, RootStackParamList } from '../types/book';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function Home({ navigation }: HomeProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [cat, setCat] = useState<string>('Tất cả');

  const loadData = async (): Promise<void> => {
    const data: Book[] = await getBooks();
    setBooks(data);
  };

  useEffect(() => {
    loadData();
    const unsub = navigation.addListener('focus', () => {
      loadData();
    });
    return unsub;
  }, [navigation]);

  const handleDelete = (item: Book): void => {
    if (item.borrowed > 0) {
      Alert.alert('Không thể xoá', 'Sách này đang có người mượn, không được xoá!');
      return;
    }

    Alert.alert('Xác nhận xoá', `Bạn có chắc muốn xoá sách "${item.title}"?`, [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          const newList: Book[] = books.filter(b => b.id !== item.id);
          setBooks(newList);
          await saveBooks(newList);
          console.log('deleted id:', item.id);
        },
      },
    ]);
  };

  let totalBorrowed: number = 0;
  for (let i = 0; i < books.length; i++) {
    totalBorrowed += books[i].borrowed;
  }

  const filterCats: string[] = ['Tất cả', ...categories];

  const filteredList: Book[] = books.filter((item: Book) => {
    const matchCat: boolean = cat === 'Tất cả' || item.category === cat;
    const text: string = keyword.trim().toLowerCase();
    const matchkeyword: boolean =
      text === '' ||
      item.title.toLowerCase().includes(text) ||
      item.author.toLowerCase().includes(text);
    return matchCat && matchkeyword;
  });

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.statsBox}>
        <Text style={styles.statsText}>Tổng đầu sách: {books.length}</Text>
        <Text style={styles.statsText}>Đang mượn: {totalBorrowed} cuốn</Text>
      </View>

      <View style={styles.topActions}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm theo tên sách hoặc tác giả..."
          value={keyword}
          onChangeText={setKeyword}
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('BookForm')}>
          <Text style={styles.addBtnText}>+ Thêm sách</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.catWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterCats.map((c: string) => {
            const active: boolean = cat === c;
            return (
              <TouchableOpacity
                key={c}
                style={[styles.catBtn, active ? styles.catBtnActive : null]}
                onPress={() => setCat(c)}>
                <Text
                  style={[
                    styles.catText,
                    active ? styles.catTextActive : null,
                  ]}>
                  {c}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredList}
        keyExtractor={(item: Book) => item.id}
        renderItem={({ item }) => (
          <BookItem
            item={item}
            onPress={() => navigation.navigate('BookDetail', { id: item.id })}
            onLongPress={() => handleDelete(item)}
            onEdit={() => navigation.navigate('BookForm', { book: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không tìm thấy sách nào</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 12,
  },
  statsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  statsText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
  },
  topActions: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    marginRight: 8,
  },
  addBtn: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  addBtnText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  catWrapper: {
    marginBottom: 10,
  },
  catBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  catBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  catText: {
    fontSize: 13,
    color: colors.text,
  },
  catTextActive: {
    color: colors.white,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.subText,
    marginTop: 30,
    fontSize: 15,
  },
});
