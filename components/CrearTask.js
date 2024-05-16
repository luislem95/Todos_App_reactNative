import React, { useEffect, useState } from "react";
import { Text, View, TextInput, Button, StyleSheet, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { handleUser } from "../requests/requests";
import { Picker } from "@react-native-picker/picker";

const ApiWork = "http://192.168.1.8:3000";
const ApiHome = "http://192.168.31.136:3000";
export default function CrearTask({ user, handleReload }) {
  const [usuarios, setUsuarios] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEnd, setFechaEnd] = useState(new Date());
  const formattedDate = new Date(
    fechaEnd.getTime() + fechaEnd.getTimezoneOffset() * 60000
  ).toLocaleDateString();
  const [idAssigned, setIdAssigned] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || fechaEnd;
    setShowDatePicker(false);
    setFechaEnd(currentDate);
  };

  const handleSubmit = async () => {
    const taskData = {
      nombre,
      descripcion,
      fechaEnd,
      idUser: user.Id,
      idAssigned,
    };

    try {
      const response = await fetch(`${ApiWork}/tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        handleReload();
        Alert.alert("Tarea creada exitosamente");
        setNombre("");
        setDescripcion("");
        setIdAssigned("");
        setFechaEnd(new Date());
      } else if (response.status >= 400 && response.status < 500) {
        const errorData = await response.json();
        Alert.alert("Error al crear la tarea", errorData.message);
      } else {
        throw new Error("Hubo un problema al crear la tarea");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  useEffect(() => {
    handleUser(setUsuarios);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Tarea</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <View style={styles.dateContainer}>
        <Button
          title="Seleccionar Fecha"
          onPress={() => setShowDatePicker(true)}
        />
        {/* <Text>{fechaEnd.toLocaleDateString()}</Text> */}
        <Text>{formattedDate}</Text>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={fechaEnd}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}
      {usuarios.length > 0 && (
        <Picker
          selectedValue={idAssigned}
          onValueChange={(itemValue, itemIndex) => setIdAssigned(itemValue)}
        >
          <Picker.Item label="Seleccionar usuario" value="" />
          {usuarios.map((usuario) => (
            <Picker.Item
              key={usuario.Id}
              label={`${usuario.Nombre} ${usuario.Apellido}`}
              value={usuario.Id}
            />
          ))}
        </Picker>
      )}
      <Button title="Crear Tarea" onPress={handleSubmit} />
    </View>
  );
}
// {usuarios.map((usuario) => (
//   <Picker.Item
//     key={usuario.Id}
//     label={
//       <View style={styles.pickerItem}>
//         <Image source={{ uri: usuario.Img }} style={styles.userImage} />
//         <Text>{`${usuario.Nombre} ${usuario.Apellido}`}</Text>
//       </View>
//     }
//     value={usuario.Id}
//   />
// ))}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
});
