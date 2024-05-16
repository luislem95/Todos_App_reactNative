import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import Login from "./components/Login";
import Tasks from "./components/Tasks";
import MyTasks from "./components/MyTasks";
import CrearTask from "./components/CrearTask";
import { Ionicons } from "@expo/vector-icons";
import { handleMyTasks, handleTasks } from "./requests/requests";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TasksStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TasksStack" component={Tasks} />
      <Stack.Screen name="MyTasks" component={MyTasks} />
      <Stack.Screen name="CrearTasks" component={CrearTask} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const modalY = useRef(new Animated.Value(-1000)).current;
  const [tasks, setTasks] = useState("");
  const [myTasks, setMyTasks] = useState("");
  const [id, setId] = useState(null);

  useEffect(() => {
    handleTasks(setTasks);
  }, []);
  useEffect(() => {
    handleMyTasks(setMyTasks, id);
  }, [id]);

  const handleReload = () => {
    handleTasks(setTasks);
    handleMyTasks(setMyTasks, id);
  };

  useEffect(() => {
    if (modalVisible) {
      // Animación de entrada
      Animated.timing(modalY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Animación de salida
      Animated.timing(modalY, {
        toValue: -1000,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible, modalY]);

  const handleLogin = (userData) => {
    setUser(userData);
    setId(userData.Id);
  };

  const handleLogout = () => {
    setUser(null);
    setModalVisible(false);
  };
  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    ) {
      // Alcance al final de la pantalla
      handleReload();
    }
  };
  return (
    <NavigationContainer>
      {!user ? (
        <Stack.Navigator>
          <Stack.Screen name="Login">
            {(props) => <Login {...props} setUser={handleLogin} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        <Tab.Navigator>
          <Tab.Screen
            name="Tasks"
            options={({ navigation }) => ({
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="reader-outline" size={size} color={color} />
              ),
              headerRight: () => (
                <View style={{ marginRight: 10 }}>
                  <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Image
                      source={{ uri: user.Img }}
                      style={{ width: 40, height: 40, borderRadius: 20 }}
                    />
                  </TouchableOpacity>
                </View>
              ),
            })}
          >
            {() => <Tasks user={user} tasks={tasks} onScroll={handleScroll} />}
          </Tab.Screen>
          <Tab.Screen
            name="MyTasks"
            options={({ navigation }) => ({
              tabBarIcon: ({ color, size }) => (
                <Ionicons
                  name="file-tray-full-outline"
                  size={size}
                  color={color}
                />
              ),
              headerRight: () => (
                <View style={{ marginRight: 10 }}>
                  <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Image
                      source={{ uri: user.Img }}
                      style={{ width: 40, height: 40, borderRadius: 20 }}
                    />
                  </TouchableOpacity>
                </View>
              ),
            })}
          >
            {() => (
              <MyTasks user={user} tasks={myTasks} onScroll={handleScroll} />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="CrearTask"
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="add-circle-outline" size={size} color={color} />
              ),
              headerRight: () => (
                <View style={{ marginRight: 10 }}>
                  <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Image
                      source={{ uri: user.Img }}
                      style={{ width: 40, height: 40, borderRadius: 20 }}
                    />
                  </TouchableOpacity>
                </View>
              ),
            }}
          >
            {() => <CrearTask user={user} handleReload={handleReload} />}
          </Tab.Screen>
        </Tab.Navigator>
      )}
      <StatusBar style="auto" />
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity
          style={styles.centeredView}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalView,
                { transform: [{ translateY: modalY }] },
              ]}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLogout()}
              >
                <Text style={styles.modalText}>Logout</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#292928",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    width: 100,
    padding: 10,
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 15,
    textAlign: "center",
    color: "#f5f53d",
  },
});
