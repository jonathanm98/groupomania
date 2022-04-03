import axios from "axios";
import { useEffect, useState } from "react";
import { UidContext } from "./components/AppContext";
import Routers from "./Routers";
import { useDispatch } from "react-redux";
import { getUser } from "./actions/user.actions";
import { getPosts } from "./actions/posts.actions";

function App() {
  const [uid, setUid] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const getAuth = () => {
      axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/api/user/auth`,
        withCredentials: true,
      })
        .then((res) => {
          setUid(res.data.id);
        })
        .catch((err) => console.log("Navigation non authentifiée"));
    };
    getAuth();

    if (uid) {
      dispatch(getUser(uid));
      dispatch(getPosts())
    }
  }, [uid]);

  return (
    <UidContext.Provider value={uid}>
      <Routers />
    </UidContext.Provider>
  );
}

export default App;
