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

type InputFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: "default" | "numeric" | "email-address";
  secureTextEntry?: boolean;
};

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  secureTextEntry = false,
}: InputFieldProps) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
    />
  </View>
);

const Register = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tel, setTel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSaveUserDriver = async () => {
    if (!name || !email || !tel || !password) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ name, email, telephone:tel, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
        router.push("/auth/login");
      } else {
        setError(data.message || "Erro ao cadastrar usuário");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      setError(errorMessage);
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

        <InputField 
          label="Nome Completo" 
          value={name} 
          onChangeText={setName} 
          placeholder="Digite seu nome" 
        />
        
        <InputField 
          label="Email" 
          value={email} 
          onChangeText={setEmail} 
          placeholder="Digite seu email" 
          keyboardType="email-address" 
        />
        
        <InputField 
          label="Telefone/WhatsApp" 
          value={tel} 
          onChangeText={setTel} 
          placeholder="(XX) XXXXX-XXXX" 
          keyboardType="numeric" 
        />
        
        <InputField 
          label="Senha" 
          value={password} 
          onChangeText={setPassword} 
          placeholder="Digite sua senha" 
          secureTextEntry 
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSaveUserDriver} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
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
    paddingBottom: 40,
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
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#CED4DA",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#84C1FF",
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
    color: "#DC3545",
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
  },
});

export default Register;