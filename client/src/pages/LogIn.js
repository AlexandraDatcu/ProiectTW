import { useState } from 'react';
import logstyle from './LogIn.module.css'; 
import CreateAccount from './CreateAccount.js'

export default function LogIn() {
    const [auth, setAuth] = useState({userName: "", password: ""});
    const [login,setLogIn] = useState(true);
    return(
            <form className={logstyle.Log}>
                    <div className={logstyle.UserLogIn}>
                        <div className={logstyle.UserValidation}>
                            <input type = 'text' placeholder='  Username' value={auth.userName}
                                onChange={(ev) => setAuth({...auth, userName: ev.target.value})}
                                className={logstyle.LogForm} required/> 

                            <input type = 'text' placeholder='  Password' value={auth.password}
                                onChange = {(ev) => setAuth({...auth,password:ev.target.value})}
                                className={logstyle.LogForm} required/>
                            <div className={logstyle.passwordForgot}>
                                <label>Forgot your password?</label>
                                <div className={logstyle.resetPassword}>Reset now</div>
                            </div>
                        </div>
                        <input type="submit" value="LOG IN" className={logstyle.BtnSubmit}></input>
                    </div>
                    
                    <div className={logstyle.Account}>
                        <label className={logstyle.NoAccount}>Don't have an account yet?</label>
                        <div className={logstyle.CreateAccount} onClick = {()=>{setLogIn(false);}}>Create one!</div>
                        {
                            !login &&  <CreateAccount/>
                        }
                    </div>
                    <div className={logstyle.NoAccount}>OR create an account with:</div>
            </form>
          
    );
}