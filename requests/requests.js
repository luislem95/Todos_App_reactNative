const ApiWork = "http://192.168.1.8:3000";
const ApiHome = "http://192.168.31.136:3000";

// `${ApiWork}/tasks`

const handleTasks = async (setTasks) => {
  try {
    const response = await fetch(`${ApiWork}/tasks/`);
    const data = await response.json();

    setTasks(data);
  } catch (Error) {
    console.log(Error);
  }
};

const handleMyTasks = async (setTasks, id) => {
  try {
    const response = await fetch(`${ApiWork}/tasks/${id}`);
    const data = await response.json();

    setTasks(data);
  } catch (error) {
    console.log(error);
  }
};

const handleUser = async (setUsuarios) => {
  try {
    const response = await fetch(`${ApiWork}/user`);
    const data = await response.json();
    setUsuarios(data.user);
  } catch (Error) {
    console.log("Error :", Error);
  }
};

export { handleTasks, handleMyTasks, handleUser };
