import ContentContainer from "../../components/ContentContainer"
import RegisterForm from "../../components/RegisterForm"
import "./Register.css"

function Register() {
  return (
    <div className="container">

    <div className="reg">
       <div className="logging-left">
        <ContentContainer/>
        </div>
      <div className="register-container">
        <h1 className="register-title">Register</h1>
        <RegisterForm />
      </div>
    </div>
    </div>
  )
}

export default Register

