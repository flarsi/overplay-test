
import type { NextPage } from 'next'
import Head from 'next/head'
import Router from "next/router";
import RegisterForm from '../components/registerForm'

const Home: NextPage = () => {
  const handleSingup = (body: { name: string, email: string; password: string }) => {
    fetch(`http://localhost:8080/api/signup`, {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
    }).then((res) => res.json()).then(data => {
      if(data.token){
        localStorage.setItem('token', data.token)
        Router.push({ pathname: "/animations/Idle"})
      }else{
        alert(JSON.stringify(data))
      }
    }).catch(e => console.log(e))
  }

return (
    <div>
      <Head>
        <title>Login Page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="vh-100 d-flex justify-content-center align-items-center">
        <RegisterForm onSubmit={handleSingup} onLogin={() => {
          Router.push({ pathname: "/"})
        }}/>
      </main>
    </div>
  )
}

export default Home