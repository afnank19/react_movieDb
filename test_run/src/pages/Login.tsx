import { useEffect, useState } from "react";
import Pages from "./Pages";
import { BrowserRouter } from "react-router-dom";

function Login() {
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loginItemLS = JSON.parse(
      localStorage.getItem("loginKey") || JSON.stringify("")
    );

    if (loginItemLS) {
      setAuthenticated(true);
    }
  }, []);

  const initLogin = async (input: any) => {
    const loginData = await fetch(
      `http://localhost:3000/authenticateLogin?q=${input}`
    );
    const loginJson = await loginData.json();

    if (loginJson[0].isPresent == 1) {
      setAuthenticated(true);
      localStorage.setItem("loginKey", JSON.stringify(input));
    } else {
      setError("ERROR: No Username found!");
    }
  };
  const loginSubmitHandler = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (input === "") {
      setError("Input field empty");
    } else {
      initLogin(input);
    }
  };

  const initRegister = async (input: any) => {
    const regData = await fetch(`http://localhost:3000/register?q=${input}`);
    const regJson = await regData.json();
    console.log(regJson);
    setError(regJson[0].REG_ERROR);
  };

  const registerSubmitHandler = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (input === "") {
      setError("Input field empty");
    } else {
      console.log("registering: " + input);
      initRegister(input);
    }
  };

  return (
    <>
      {true ? (
        <BrowserRouter>
          <Pages />
        </BrowserRouter>
      ) : (
        <div className="login">
          <form>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                onChange={(e) => setInput(e.target.value)}
              />
              <div id="emailHelp" className="form-text">
                We'll never share your data with anyone else.
              </div>
              <div id="emailHelp" className=" login-error">
                {error}
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-outline-danger"
              onClick={loginSubmitHandler}
            >
              Login
            </button>
            <button
              type="submit"
              className="btn btn-outline-danger ms-2"
              onClick={registerSubmitHandler}
            >
              Register
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Login;
