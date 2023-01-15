import { useState } from 'react';
import logstyle from './LogIn.module.css'; 
import { backendRequest } from '../backend';
import { useMutation } from '@tanstack/react-query';
import { useUserStore } from '../state/User';

export default function LogIn() {
    const [state, setState] = useState({username: "", password: "", loggingIn: true});
    const setJwtToken = useUserStore((state) => state.setJwt);
    const {mutate, isError, isLoading, error} = useMutation({
        mutationFn: ({loggingIn, ...user}) =>
            backendRequest("POST", loggingIn ? "/Login" : "/CreateAccount", user),
        onSuccess(data) {
            setJwtToken((data.validAuthorization));
        }
    });

    return(
        <form className={logstyle.Log} onSubmit={(ev) => {
            ev.preventDefault();
            mutate(state);
        }}>
            {isError && <h3>{`${error}`}</h3>}
            <div className={logstyle.UserLogIn}>
                <div className={logstyle.UserValidation}>
                    <input type = 'text' placeholder='Username' value={state.username}
                        onChange={(ev) => setState({...state, username: ev.target.value})}
                        className={logstyle.LogForm} required/> 

                    <input type = 'password' placeholder='Password' value={state.password}
                        onChange = {(ev) => setState({...state,password:ev.target.value})}
                        className={logstyle.LogForm} required/>
                    <div className={logstyle.passwordForgot}>
                        <label>Forgot your password?</label>
                        <div className={logstyle.resetPassword}>Reset now</div>
                    </div>
                </div>
                <button
                    disabled={isLoading}
                    type="submit" className={logstyle.BtnSubmit}>
                    {isLoading? "Loading" : state.loggingIn ? "Log In" : "Register"}
                </button>
            </div>

            <div className={logstyle.Account}>
                <label className={logstyle.NoAccount}>
                    {state.loggingIn ? "Don't have an account yet?" : "Want to sign in?"}</label>
                <div
                    className={logstyle.CreateAccount}
                    onClick = {()=>{setState((old) => ({...old, loggingIn: !state.loggingIn}));}}
                >
                    {state.loggingIn ? "Create one!" : "Sign in!"}
                </div>
            </div>
        </form>
    );
}
