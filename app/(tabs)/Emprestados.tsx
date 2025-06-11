import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'

const API_BASE_URL = 'http://localhost:8000/api' // Ajuste para seu IP se necessário

const Emprestados = () => {
  const [searchText, setSearchText] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  // 1. Listar todos os itens
  const fetchAllItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/items`, {
        headers: {
          'Accept': 'application/json'
        }
      })
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.message || 'Erro ao carregar itens')
      setItems(data)
    } catch (err) {
      setError(err.message)
      Alert.alert('Erro', err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // 2. Listar itens por categoria
  const fetchItemsByCategory = async (categoryId) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/categorias/${categoryId}`, {
        headers: {
          'Accept': 'application/json'
        }
      })
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.message || 'Erro ao carregar itens por categoria')
      setItems(data)
      setSelectedCategory(categoryId)
    } catch (err) {
      setError(err.message)
      Alert.alert('Erro', err.message)
    } finally {
      setLoading(false)
    }
  }

  // 3. Ver item específico
  const fetchItemById = async (itemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
        headers: {
          'Accept': 'application/json'
        }
      })
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.message || 'Erro ao carregar item')
      return data
    } catch (err) {
      Alert.alert('Erro', err.message)
      throw err
    }
  }

  // 4. Atualizar item
  const updateItem = async (itemId, updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      })
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.message || 'Erro ao atualizar item')
      
      // Atualiza a lista após a edição
      if (selectedCategory) {
        fetchItemsByCategory(selectedCategory)
      } else {
        fetchAllItems()
      }
      
      return data
    } catch (err) {
      Alert.alert('Erro', err.message)
      throw err
    }
  }

  // 5. Deletar item
  const deleteItem = async (itemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erro ao deletar item')
      }
      
      // Atualiza a lista após a exclusão
      if (selectedCategory) {
        fetchItemsByCategory(selectedCategory)
      } else {
        fetchAllItems()
      }
      
      Alert.alert('Sucesso', 'Item deletado com sucesso')
    } catch (err) {
      Alert.alert('Erro', err.message)
    }
  }

  // Função para recarregar os dados
  const onRefresh = () => {
    setRefreshing(true)
    if (selectedCategory) {
      fetchItemsByCategory(selectedCategory)
    } else {
      fetchAllItems()
    }
  }

  useEffect(() => {
    fetchAllItems()
  }, [])

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase())
  )

  const handleItemPress = async (itemId) => {
    try {
      const itemDetails = await fetchItemById(itemId)
      Alert.alert(
        'Detalhes do Item',
        `Nome: ${itemDetails.name}\nPreço: R$ ${itemDetails.price?.toFixed(2) || 'N/A'}`,
        [
          { text: 'Editar', onPress: () => handleEditItem(itemId) },
          { text: 'Excluir', onPress: () => handleDeleteItem(itemId) },
          { text: 'Cancelar', style: 'cancel' }
        ]
      )
    } catch (err) {
      console.error(err)
    }
  }

  const handleEditItem = (itemId) => {
    // Implemente a lógica de edição aqui
    Alert.prompt(
      'Editar Item',
      'Digite o novo nome e preço (separados por vírgula)',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Salvar', 
          onPress: (text) => {
            const [name, price] = text.split(',')
            updateItem(itemId, { 
              name: name.trim(), 
              price: parseFloat(price.trim()) 
            })
          }
        }
      ],
      'plain-text'
    )
  }

  const handleDeleteItem = (itemId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este item?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', onPress: () => deleteItem(itemId) }
      ]
    )
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emprestados</Text>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Itens"
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
      </View>

      {/* Seletor de Categorias */}
      <View style={styles.categoryContainer}>
        <Text style={styles.sectionTitle}>Categorias:</Text>
        <View style={styles.categoryButtons}>
          <TouchableOpacity 
            style={[styles.categoryButton, !selectedCategory && styles.activeCategory]}
            onPress={() => {
              setSelectedCategory(null)
              fetchAllItems()
            }}
          >
            <Text style={styles.categoryButtonText}>Todos</Text>
          </TouchableOpacity>
          
          {/* Exemplo com 3 categorias - ajuste conforme sua API */}
          {[1, 2, 3].map(catId => (
            <TouchableOpacity 
              key={catId}
              style={[styles.categoryButton, selectedCategory === catId && styles.activeCategory]}
              onPress={() => fetchItemsByCategory(catId)}
            >
              <Text style={styles.categoryButtonText}>Categoria {catId}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.itemContainer}
            onPress={() => handleItemPress(item.id)}
          >
            <Text style={styles.itemName}>{item.name}</Text>
            {item.description && <Text style={styles.itemDetail}>{item.description}</Text>}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum item encontrado</Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  categoryContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
  },
  activeCategory: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    color: '#333',
  },
  activeCategoryText: {
    color: 'white',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  itemDetail: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
  },
})

export default Emprestados