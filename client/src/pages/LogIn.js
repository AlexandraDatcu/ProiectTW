import { useState } from 'react';
import logstyle from './LogIn.module.css'; 
function LogIn() {
    const [auth, setAuth] = useState({userName: "", password: ""});
    return(
        <form className={logstyle.Log}>
            <input type = 'text' placeholder='Username' value={auth.userName}
                onChange={(ev) => setAuth({...auth, userName: ev.target.value})}
                className={logstyle.LogForm} required/> 

            <input type = 'text' placeholder='Password' value={auth.password} className={logstyle.LogForm} required/>
            <input type="submit" value="LOG IN"></input>
        </form>
    );
}

export default LogIn;
