import React, { useState, useEffect } from 'react';
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

const categoryMap: { [key: number]: string } = {
  1: 'Ferramentas',
  2: 'Livros',
  3: 'Eletrônicos',
};

const categoryNameToId = (name: string): number | null => {
  const entry = Object.entries(categoryMap).find(([, value]) => value === name);
  return entry ? parseInt(entry[0], 10) : null;
};

const Index = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form inputs
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemCategoryId, setItemCategoryId] = useState('');
  const [itemexpiry_date, setexpiry_date] = useState('');

  const filteredItems = filter
    ? items.filter(item => categoryMap[item.category_id] === filter)
    : items;

  const resetForm = () => {
    setItemName('');
    setItemDesc('');
    setItemCategoryId('');
    setexpiry_date('');
  };

  const saveItem = async () => {
    if (!itemName || !itemDesc || !itemCategoryId || !itemexpiry_date) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const categoryId = categoryNameToId(itemCategoryId);
    if (!categoryId) {
      Alert.alert('Erro', 'Categoria inválida');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: itemName,
          description: itemDesc,
          category_id: categoryId,
          expiry_date: itemexpiry_date,
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
      resetForm();
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/items', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          Alert.alert('Erro', errorData.message || 'Erro ao buscar itens');
          return;
        }

        const data = await response.json();
        setItems(data);
      } catch (error) {
        Alert.alert('Erro', error instanceof Error ? error.message : 'Erro desconhecido ao buscar itens');
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const fetchItemOne = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/items/1', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          const error = await response.json();
          console.warn('Erro ao buscar item 1:', error.message);
          return;
        }

        const item = await response.json();
        console.log('Item com ID 1:', item);
      } catch (err) {
        console.warn('Erro ao buscar item 1:', err instanceof Error ? err.message : 'Erro desconhecido');
      }
    };

    fetchItemOne();
  }, []);

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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>Categoria: {categoryMap[item.category_id]}</Text>
            <Text>Localização: {item.location}</Text>
            <Text>Prazo de Devolução: {item.expiry_date}</Text>
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
              placeholder="Categoria (ex: Ferramentas)"
              value={itemCategoryId}
              onChangeText={setItemCategoryId}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Data de Devolução (ex: 2025-05-30)"
              value={itemexpiry_date}
              onChangeText={setexpiry_date}
            />

            <View style={styles.modalButtons}>
              <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#fff' }}>Cancelar</Text>
              </Pressable>

              <Pressable style={styles.saveButton} onPress={saveItem} disabled={loading}>
                <Text style={{ color: '#fff' }}>{loading ? 'Salvando...' : 'Salvar'}</Text>
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
    bottom: 90,
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
