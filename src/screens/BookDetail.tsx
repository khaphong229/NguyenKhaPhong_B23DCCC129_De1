import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getBooks, saveBooks } from '../storage';
import { colors } from '../colors';
import { Book, RootStackParamList } from '../types/book';

type BookDetailProps = NativeStackScreenProps<RootStackParamList, 'BookDetail'>;

export default function BookDetail({ navigation, route }: BookDetailProps) {
  const bookId: string = route.params.id;
  const [book, setBook] = useState<Book | null>(null);

  const loadBook = async (): Promise<void> => {
    const list: Book[] = await getBooks();
    const found: Book | undefined = list.find(
      (item: Book) => item.id === bookId,
    );
    if (found) {
      setBook(found);
    }
  };

  useEffect(() => {
    loadBook();
    const unsub = navigation.addListener('focus', () => {
      loadBook();
    });
    return unsub;
  }, [navigation, bookId]);

  const handleBorrow = async (): Promise<void> => {
    if (!book) {
      return;
    }
    const remain: number = book.quantity - book.borrowed;
    if (remain <= 0) {
      return;
    }

    const list: Book[] = await getBooks();
    const newList: Book[] = list.map((item: Book) => {
      if (item.id === book.id) {
        const updated: Book = { ...item, borrowed: item.borrowed + 1 };
        setBook(updated);
        return updated;
      }
      return item;
    });
    await saveBooks(newList);
    console.log('borrow book:', book.id);
  };

  const handleReturn = async (): Promise<void> => {
    if (!book) {
      return;
    }
    if (book.borrowed <= 0) {
      return;
    }

    const list: Book[] = await getBooks();
    const newList: Book[] = list.map((item: Book) => {
      if (item.id === book.id) {
        const updated: Book = { ...item, borrowed: item.borrowed - 1 };
        setBook(updated);
        return updated;
      }
      return item;
    });
    await saveBooks(newList);
    console.log('return book:', book.id);
  };

  if (!book) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>Đang tải thông tin sách...</Text>
      </View>
    );
  }

  const remain: number = book.quantity - book.borrowed;
  const cannotBorrow: boolean = remain <= 0;
  const cannotReturn: boolean = book.borrowed <= 0;

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.card}>
        <Text style={styles.title}>{book.title}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Mã sách:</Text>
          <Text style={styles.val}>{book.id}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tác giả:</Text>
          <Text style={styles.val}>{book.author}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Thể loại:</Text>
          <Text style={styles.val}>{book.category}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Năm xuất bản:</Text>
          <Text style={styles.val}>{book.year}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tổng số cuốn:</Text>
          <Text style={styles.val}>{book.quantity}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Đang được mượn:</Text>
          <Text style={styles.val}>{book.borrowed}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Số cuốn còn lại:</Text>
          <Text
            style={[
              styles.val,
              remain === 0 ? styles.redText : styles.greenText,
            ]}>
            {remain} {remain === 0 ? '(Hết sách)' : ''}
          </Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[
            styles.actionBtn,
            styles.borrowBtn,
            cannotBorrow ? styles.disabledBtn : null,
          ]}
          disabled={cannotBorrow}
          onPress={handleBorrow}>
          <Text style={styles.btnText}>Cho mượn</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionBtn,
            styles.returnBtn,
            cannotReturn ? styles.disabledBtn : null,
          ]}
          disabled={cannotReturn}
          onPress={handleReturn}>
          <Text style={styles.btnText}>Nhận trả</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => navigation.navigate('BookForm', { book: book })}>
        <Text style={styles.editBtnText}>Sửa thông tin sách</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 16,
  },
  card: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.bg,
  },
  label: {
    fontSize: 15,
    color: colors.subText,
  },
  val: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
  },
  redText: {
    color: colors.red,
  },
  greenText: {
    color: colors.green,
  },
  infoText: {
    fontSize: 15,
    color: colors.subText,
    textAlign: 'center',
    marginTop: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  borrowBtn: {
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  returnBtn: {
    backgroundColor: colors.green,
    marginLeft: 8,
  },
  disabledBtn: {
    backgroundColor: colors.gray,
  },
  btnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  editBtn: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  editBtnText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
