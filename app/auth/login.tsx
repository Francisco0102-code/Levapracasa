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
  
  const Login = () => {
    const router = useRouter();
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
  
    const handleLogin = async () => {
      if (!email || !password) {
        Alert.alert("Atenção", "Preencha todos os campos.");
        return;
      }
  
      setLoading(true);
  
      try {
        const response = await fetch("http://localhost:8000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          Alert.alert("Sucesso", "Login realizado com sucesso!");
          router.push("/(tabs)");
        } else {
          Alert.alert("Erro", data.message || "Erro ao fazer login");
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
          <Text style={styles.headerText}>Login</Text>
        </View>
  
        {/* Formulário */}
        <ScrollView contentContainerStyle={styles.form}>
          <Text style={styles.subtitle}>Digite suas credenciais para entrar:</Text>
  
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="Digite sua senha"
            secureTextEntry
          />
  
          <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </Pressable>
  
          <Pressable onPress={() => router.push('/auth/register')}>
            <Text style={styles.loginText}>
              Não tem uma conta? Cadastre-se aqui.
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
  });
  
  export default Login;
  