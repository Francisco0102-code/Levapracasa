import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';

const initialItems = [
  { id: '1', name: 'Furadeira', description: 'Furadeira elétrica', location: 'São Paulo', returnDate: '30/05/2025', category: 'Ferramentas' },
  { id: '2', name: 'Livro de JavaScript', description: 'Livro sobre programação', location: 'Rio de Janeiro', returnDate: '05/06/2025', category: 'Livros' },
];

const Index = () => {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Campos do formulário
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategoryId, setItemCategoryId] = useState('');

  const filteredItems = filter ? items.filter(item => item.category === filter) : items;

  const saveItem = async () => {
    if (!itemName || !itemDesc || !itemPrice || !itemCategoryId) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: itemName,
          description: itemDesc,
          price: parseFloat(itemPrice),
          category_id: parseInt(itemCategoryId),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Erro', errorData.message || 'Erro ao salvar item');
        return;
      }

      const newItem = await response.json();

      setItems(prev => [...prev, newItem]);
      Alert.alert('Sucesso', 'Item salvo com sucesso!');
      setItemName('');
      setItemDesc('');
      setItemPrice('');
      setItemCategoryId('');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro desconhecido');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Itens Disponíveis</Text>

      <View style={styles.filters}>
        <Pressable onPress={() => setFilter(null)}><Text style={styles.filterText}>Todos</Text></Pressable>
        <Pressable onPress={() => setFilter('Ferramentas')}><Text style={styles.filterText}>Ferramentas</Text></Pressable>
        <Pressable onPress={() => setFilter('Livros')}><Text style={styles.filterText}>Livros</Text></Pressable>
        <Pressable onPress={() => setFilter('Eletrônicos')}><Text style={styles.filterText}>Eletrônicos</Text></Pressable>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>Localização: {item.location}</Text>
            <Text>Prazo de Devolução: {item.returnDate}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal de Adição */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Adicionar Novo Item</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Nome do item"
              value={itemName}
              onChangeText={setItemName}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Descrição"
              value={itemDesc}
              onChangeText={setItemDesc}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Preço (ex: 10.99)"
              value={itemPrice}
              onChangeText={setItemPrice}
              keyboardType="decimal-pad"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="ID da Categoria (ex: 1)"
              value={itemCategoryId}
              onChangeText={setItemCategoryId}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#fff' }}>Cancelar</Text>
              </Pressable>

              <Pressable style={styles.saveButton} onPress={saveItem}>
                <Text style={{ color: '#fff' }}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  filters: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  filterText: { fontSize: 16, color: '#007BFF' },
  item: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#007BFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
});

export default Index;
