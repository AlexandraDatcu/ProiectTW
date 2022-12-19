import styles from './MainNavigation.module.css';
import LogIn from '../pages/LogIn';
import Reviews from '../pages/Reviews';
import { useState } from 'react';

export default function MainNavigation(){
    const [activeIndex, setActiveIndex] = useState(3);  
    
    return(
        <header>
            <div className={styles.meniu}>
                <label className={styles.logo}>Transport Reviews</label>
                <div className={styles.buttonsMeniu}>
                    <button className={styles.btnNav} onClick={()=>setActiveIndex(1)}>Search</button>
                    <button className={styles.btnNav} onClick={()=>setActiveIndex(2)}>Reviews</button>
                    <button className={styles.btnNav} onClick={()=>setActiveIndex(3)}>Log in</button>
                </div>
            </div>
            {activeIndex === 2 && <Reviews/>}
            {activeIndex === 3 && <LogIn/>}
            
            
        </header>
    )
}