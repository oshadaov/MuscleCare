import LoginForm from "../../components/LoginForm"
import "./Login.css"
// import DP from '../../assets/Bg.jpg'
import ContentContainer from "../../components/ContentContainer"

function Login({ setIsLoggedIn }) {
  return (
    <div className="container">
      <div className="lo">
      
      <div className="login-container">
        <h1 className="login-title">Login</h1>
        <LoginForm setIsLoggedIn={setIsLoggedIn} />
      </div>
      <div className="logging-left">
        <ContentContainer/>
        </div>
        </div>
    </div>
  )
}

export default Login

