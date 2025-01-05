import { NavLink } from 'react-router-dom';
function SignUpBtn() {
    return (
        <NavLink to={'/register'}>
        <button className="btn btn-secondary login-btn px-3">Sign up</button>
        </NavLink>

    )

}
export default SignUpBtn;