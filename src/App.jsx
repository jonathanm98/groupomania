import axios from "axios";
import { useEffect, useState } from "react";
import { UidContext } from "./components/AppContext.jsx";
import Routers from "./Routers.jsx";
import { useDispatch } from "react-redux";
import { getUser } from "./actions/user.actions";
import { getUsers } from "./actions/users.actions";

function App() {
  const [uid, setUid] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const getAuth = () => {
      axios({
        method: "GET",
        url: `${import.meta.env.VITE_API_URL}/api/user/auth`,
        withCredentials: true,
      })
        .then((res) => {
          setUid(res.data);
        })
        .catch((err) => console.log("Navigation non authentifiée"));
    };
    getAuth();

    if (uid) {
      dispatch(getUser(uid));
      dispatch(getUsers())
    }
    //eslint-disable-next-line
  }, [uid]);

  return (
    <UidContext.Provider value={uid}>
      <Routers />
    </UidContext.Provider>
  );
}

export default App;
