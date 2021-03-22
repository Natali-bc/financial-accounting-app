import axios from "axios";
import authActions from "./auth-actions";
import api from "../../services/backend.service";
import transactionsActions from "../transaction/transaction-actions";

// axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.baseURL = "https://kapusta-srv.herokuapp.com";

const token = {
  set(token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
  unset() {
    axios.defaults.headers.common.Authorization = "";
  },
};

const register = (credentials, history) => (dispatch) => {
  dispatch(authActions.registerRequest());
  api
    .register(credentials)
    .then(({ data }) => {
      dispatch(authActions.registerSuccess(data));
    })
    .then(() => history.push("/login"))
    .catch((data) => {
      if (!data.response) {
        dispatch(authActions.loginError(data.message));
        return;
      }
      dispatch(authActions.registerError(data?.response?.data?.message));
    });
};

const logIn = (credentials) => (dispatch) => {
  dispatch(authActions.loginRequest());
  api
    .login(credentials)
    .then(({ data }) => {
      api.setToken(data.token);
      const { token, name, email, avatarURL } = data;
      dispatch(authActions.loginSuccess({ name, email, avatarURL, token }));
    })
    .catch((data) => {
      if (!data.response) {
        dispatch(authActions.loginError(data.message));
        return;
      }
      dispatch(authActions.loginError(data?.response?.data?.message));
    });
};

const logInWithGoogle = (googleToken) => (dispatch) => {
  dispatch(authActions.loginWithGoogleRequest());
  api
    .loginWithGoogle(googleToken)
    .then(({ data }) => {
      api.setToken(data.token);
      const { token, name, email, avatarURL } = data;
      dispatch(
        authActions.loginWithGoogleSuccess({ name, email, avatarURL, token }),
      );
    })
    .catch((data) => {
      if (!data.response) {
        dispatch(authActions.loginWithGoogleError(data.message));
        return;
      }
      dispatch(authActions.loginWithGoogleError(data?.response?.data?.message));
    });
};

const logOut = () => async (dispatch) => {
  dispatch(authActions.logOutRequest());
  try {
    await axios.post("/auth/logout");
    token.unset();
    dispatch(authActions.logOutSuccess());
  } catch (error) {
    dispatch(authActions.logOutError(error.message));
  }
};

const getCurrrentUser = () => async (dispatch, getState) => {
  const {
    auth: { token: persistedToken },
  } = getState();
  if (!persistedToken) {
    return;
  }
  token.set(persistedToken);
  dispatch(authActions.getCurrentUserRequest());
  try {
    const response = await axios.get("/user");
    dispatch(authActions.getCurrentUserSuccess(response.data));
    dispatch(transactionsActions.setBalanceSucces(response.data.balance));
  } catch (error) {
    dispatch(authActions.getCurrentUserError(error.message));
  }
};

const authOperations = {
  register,
  logOut,
  getCurrrentUser,
  logIn,
  logInWithGoogle,
};

export default authOperations;
