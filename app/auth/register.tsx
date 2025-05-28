import {
    View,
    Text,
    TextInput,
    ScrollView,
    Pressable,
    Alert,
    StyleSheet,
    ActivityIndicator,
  } from "react-native";
  import React, { useState } from "react";
  import { MaterialIcons } from "@expo/vector-icons";
  import { useRouter } from "expo-router";
  
  const Register = () => {
    const router = useRouter();
  
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [tel, setTel] = useState("");
    const [loading, setLoading] = useState(false);
  
    const handleSaveUserDriver = async () => {
      if (!name || !email || !tel || !password) {
        Alert.alert("Atenção", "Preencha todos os campos.");
        return;
      }
  
      setLoading(true);
  
      try {
        const response = await fetch("http://localhost:8000/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, tel, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
          router.push("/(tabs)");
        } else {
          Alert.alert("Erro", data.message || "Erro ao cadastrar motorista");
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        Alert.alert("Erro", errorMessage);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" color="#fff" size={24} />
          </Pressable>
          <Text style={styles.headerText}>Criar Conta</Text>
        </View>
  
        {/* Formulário */}
        <ScrollView contentContainerStyle={styles.form}>
          <Text style={styles.subtitle}>
            Preencha as informações abaixo para criar sua conta:
          </Text>
  
          <InputField label="Nome Completo" value={name} onChangeText={setName} placeholder="Digite seu nome" />
          <InputField label="Email" value={email} onChangeText={setEmail} placeholder="Digite seu email" keyboardType="email-address" />
          <InputField label="Telefone/WhatsApp" value={tel} onChangeText={setTel} placeholder="(XX) XXXXX-XXXX" keyboardType="numeric" />
          <InputField label="Senha" value={password} onChangeText={setPassword} placeholder="Digite sua senha" secureTextEntry />
  
          <Pressable style={styles.button} onPress={handleSaveUserDriver} disabled={loading} >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
          </Pressable>

          <Pressable onPress={() => router.push('/auth/login')}>
  <Text style={styles.loginText}>
    Já tem uma conta? Faça login aqui.
  </Text>
</Pressable>
        </ScrollView>
      </View>
    );
  };
  
  // Componente reutilizável de input com label
  const InputField = ({  ...props }) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{}</Text>
      <TextInput style={styles.input} {...props} />
    </View>
  );
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F8F9FA",
    },
    header: {
      backgroundColor: "#1E1E1E",
      height: 100,
      paddingTop: 48,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
    },
    backButton: {
      marginRight: 12,
    },
    headerText: {
      color: "#FFF",
      fontSize: 22,
      fontWeight: "bold",
    },
    form: {
      padding: 24,
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 24,
      color: "#333",
    },
    label: {
      fontSize: 14,
      marginBottom: 4,
      color: "#555",
    },
    input: {
      backgroundColor: "#fff",
      borderColor: "#CED4DA",
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      height: 44,
    },
    button: {
      marginTop: 16,
      backgroundColor: "#007BFF",
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    loginText: {
      marginTop: 16,
      color: "#007BFF",
      textAlign: "center",
      textDecorationLine: "underline",
      fontSize: 14,
    },
    errorText: {
      color: "red",
      marginTop: 8,
      textAlign: "center",
    },    
  });
  
  export default Register;
  