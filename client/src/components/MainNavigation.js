import styles from './MainNavigation.module.css';
import LogIn from '../pages/LogIn';
import { useState } from 'react';

function MainNavigation(){
    const [Islog, setLogIsOpen] = useState(false);
    const [IsSearch, setSearchOpen] = useState(false);
    const [IsReview, setReviewOpen] = useState(false);
    return(
        <header>
            <div className={styles.meniu}>
                <label className={styles.logo}>Transport Reviews</label>
                <div className={styles.buttonsMeniu}>
                    <button className={styles.btnNav}>Search</button>
                    <button className={styles.btnNav} onClick={() => setLogIsOpen(true)}>Reviews</button>
                    <button className={styles.btnNav} onClick={() => setLogIsOpen(true)}>Log in</button>
                </div>
            </div>
            {Islog ? <LogIn/> : null}
        </header>
    )
}

export default MainNavigation;