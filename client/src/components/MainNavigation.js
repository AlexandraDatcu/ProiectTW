import styles from './MainNavigation.module.css';
import LogIn from '../pages/LogIn';
import Reviews from '../pages/Reviews';
import MyAccount from '../pages/MyAccount';
import { useState } from 'react';
import { useUserName } from '../state/User';

export default function MainNavigation(){
    const [activeIndex, setActiveIndex] = useState(3);  
    const buttonProps = (idx) => ({
        className: [styles.btnNav, idx === activeIndex ? styles.active : ""].join(" "),
        onClick() {
            setActiveIndex(idx);
        }
    });
    const userName = useUserName();
    
    return(
        <header>
            <div className={styles.meniu}>
                <label className={styles.logo}>Transport Reviews</label>
                <div className={styles.buttonsMeniu}>
                    <button {...buttonProps(1)}>Search</button>
                    <button {...buttonProps(2)}>Reviews</button>
                    <button {...buttonProps(3)}> {userName || "Log in"}</button>
                </div>
            </div>
            {activeIndex === 2 && <Reviews/>}
            {activeIndex === 3 && (userName ? <MyAccount/> : <LogIn/>)}
            
        </header>
    )
}