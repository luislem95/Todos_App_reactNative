import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, View, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import moment from "moment";
import { handleMyTasks } from "../requests/requests";

export default function MyTasks({ tasks, user, onScroll }) {
  const formatDate = (dateString) => {
    const date = moment(dateString).format("DD/MM/YYYY");
    return date;
  };

  const getTaskColor = (dateString) => {
    const date = moment(dateString);
    const today = moment();
    const tomorrow = moment().add(1, "day");

    if (date.isBefore(today, "day")) {
      return "red"; // Date has already passed
    } else if (date.isSame(today, "day")) {
      return "red"; // Date is today
    } else if (date.isSame(tomorrow, "day")) {
      return "black"; // Date is tomorrow
    } else {
      return "green"; // Date is more than two days from today
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.taskContainer}>
            <View style={styles.imageContainer}>
              <Text style={styles.title}>{item.Nombre}</Text>
              {/* <Text>{item.FechaEnd}</Text> */}
              <Text
                style={[styles.fecha, { color: getTaskColor(item.FechaEnd) }]}
              >
                {formatDate(item.FechaEnd)}
              </Text>
            </View>
            <Text>{item.Descripcion}</Text>
            <View style={styles.imageContainer}>
              <TouchableOpacity
                style={styles.imageButton}
                onPress={() => console.log("Creator:", item.UserId)}
              >
                <Image source={{ uri: item.UserImg }} style={styles.image} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.imageButton}
                onPress={() => console.log("Assigned:", item.IdAssigned)}
              >
                <Image
                  source={{ uri: item.AssignedImg }}
                  style={styles.image}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.Id.toString()}
        contentContainerStyle={styles.contentContainerStyle}
        onScroll={onScroll}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#cccccc",
  },
  contentContainerStyle: {
    padding: 15,
  },
  taskContainer: {
    width: "100%",
    backgroundColor: "#ffffff",
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 15,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  imageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  fecha: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 15,
  },
});
