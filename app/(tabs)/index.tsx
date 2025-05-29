import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, Pressable } from 'react-native';
import { Redirect, router } from 'expo-router';




const items = [
  { id: '1', name: 'Furadeira', description: 'Furadeira elétrica', location: 'São Paulo', returnDate: '30/05/2025', category: 'Ferramentas' },
  { id: '2', name: 'Livro de JavaScript', description: 'Livro sobre programação', location: 'Rio de Janeiro', returnDate: '05/06/2025', category: 'Livros' },
  { id: '3', name: 'Notebook', description: 'Notebook Dell', location: 'Belo Horizonte', returnDate: '10/06/2025', category: 'Eletrônicos' },
  { id: '4', name: 'Martelo', description: 'Martelo de carpinteiro', location: 'Curitiba', returnDate: '15/06/2025', category: 'Ferramentas' },
  { id: '5', name: 'Livro de React Native', description: 'Livro sobre desenvolvimento mobile', location: 'Porto Alegre', returnDate: '20/06/2025', category: 'Livros' },
  { id: '6', name: 'Smartphone Android', description: 'Smartphone Samsung Galaxy', location: 'Salvador', returnDate: '25/06/2025', category: 'Eletrônicos' },
  { id: '7', name: 'Chave Inglesa', description: 'Chave inglesa ajustável', location: 'Fortaleza', returnDate: '30/06/2025', category: 'Ferramentas' },
  { id: '8', name: 'Livro de Python', description: 'Livro sobre programação em Python', location: 'Recife', returnDate: '05/07/2025', category: 'Livros' },
  { id: '9', name: 'Tablet', description: 'Tablet Apple iPad', location: 'Manaus', returnDate: '10/07/2025', category: 'Eletrônicos' },
  { id: '10', name: 'Alicate', description: 'Alicate de corte', location: 'Brasília', returnDate: '15/07/2025', category: 'Ferramentas' },  
];

const Index = () => {
  return <Redirect href="/auth/register" />;

  const [filter, setFilter] = useState<string | null>(null);

  const filteredItems = filter ? items.filter(item => item.category === filter) : items;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Itens Disponíveis</Text>
      
      {/* Filtros */}
      <View style={styles.filters}>
        <Button title="Todos" onPress={() => setFilter(null)} />
        <Button title="Ferramentas" onPress={() => setFilter('Ferramentas')} />
        <Button title="Livros" onPress={() => setFilter('Livros')} />
        <Button title="Eletrônicos" onPress={() => setFilter('Eletrônicos')} />
      </View>

      {/* Lista de Itens */}
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

      {/* Botão de Adicionar */}
      <TouchableOpacity style={styles.addButton} onPress={() => alert('Adicionar novo item')}>
        <Pressable onPress={() => router.push('/(tabs)/adicionar')}>
        <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
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
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Index;