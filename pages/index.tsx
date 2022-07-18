import type { NextPage } from "next";
import Head from "next/head";
import Router from "next/router";
import LoginForm from "../components/loginForm";

const Home: NextPage = () => {
  const handleSingIn = (body: { email: string; password: string }) => {
    fetch(`http://localhost:8080/api/signin`, {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          Router.push({ pathname: "/animations/Idle" });
        }else{
          alert(JSON.stringify(data))
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <div>
      <Head>
        <title>Login Page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="vh-100 d-flex justify-content-center align-items-center">
        <LoginForm
          onSubmit={handleSingIn}
          onAnimations={() => {
            Router.push({ pathname: "/animations/Idle" });
          }}
          onSignUp={() => {
            Router.push({ pathname: "/signUp" });
          }}
        />
      </main>
    </div>
  );
};

export default Home;
