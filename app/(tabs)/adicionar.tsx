// app/my-loans.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';

type LoanItem = {
  id: string;
  name: string;
  description: string;
  location: string;
  status: 'disponível' | 'emprestado' | 'devolvido';
  return_date?: string;
};

export default function MyLoans() {
  const [loans, setLoans] = useState<LoanItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://SEU_IP_OU_DOMINIO/api/my-loans', {
        headers: {
          'Content-Type': 'application/json',
          // Se usar token:
          // Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar empréstimos');
      }

      const data = await response.json();
      setLoans(data.loans || []);
    } catch (error) {
      console.error(error);
      // Pode alertar ou mostrar mensagem na tela
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLoans();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Empréstimos</Text>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={loans}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum empréstimo encontrado.</Text>}
          renderItem={({ item }) => (
            <View style={styles.loanItem}>
              <Text style={styles.loanName}>{item.name}</Text>
              <Text>{item.description}</Text>
              <Text>Localização: {item.location}</Text>
              <Text>Status: <Text style={{ fontWeight: 'bold' }}>{item.status}</Text></Text>
              {item.return_date && <Text>Devolver até: {item.return_date}</Text>}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  loanItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  loanName: { fontSize: 18, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#999' },
});
