import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import TaskList from "./TasksList";

export default function Tasks({ user, tasks, onScroll }) {
  const navigation = useNavigation();
  // Desestructura los datos del usuario
  useEffect(() => {
    navigation.setOptions({
      headerShown: true, // Oculta el encabezado predeterminado
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TaskList user={user} tasks={tasks} onScroll={onScroll} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
