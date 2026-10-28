import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Book } from "../types/book";
import { colors } from "../colors";

interface BookItemProps {
    item: Book;
    onPress: () => void;
    onLongPress: () => void;
    onEdit: () => void;
}

export default function BookItem({ item, onPress, onLongPress, onEdit }: BookItemProps) {
  const remain = item.quantity - item.borrowed;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.editText}>Sửa</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sub}>Tác giả: {item.author}</Text>
      <Text style={styles.sub}>Thể loại: {item.category}</Text>

      <View style={styles.bottomRow}>
        <Text style={styles.remainText}>Còn lại: {remain} cuốn</Text>
        {remain === 0 ? (
          <Text style={styles.outBadge}>Hết sách</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  editButton: {
    backgroundColor: colors.lightBlue,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  editText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  sub: {
    fontSize: 14,
    color: colors.subText,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  remainText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  outBadge: {
    color: colors.red,
    fontWeight: 'bold',
    fontSize: 14,
  },
});