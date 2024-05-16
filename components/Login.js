import React from "react";
import {
  TextInput,
  Button,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
const ApiWork = "http://192.168.1.8:3000";
const ApiHome = "http://192.168.31.136:3000";
export default function Login({ setUser }) {
  const navigation = useNavigation();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(`${ApiWork}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Serializa solo el email
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setUser(data.user); // Guardar información del usuario en el estado
        // Guardar solo el email en AsyncStorage
        await AsyncStorage.setItem("userEmail", email);
      } else {
        alert(data.error); // Mostrar mensaje de error si la autenticación falla
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email de usuario"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
    width: 70,
    backgroundColor: "#ccc",
  },
});
