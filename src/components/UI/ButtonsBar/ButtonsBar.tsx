import React, {FC} from 'react';
import styles from './bar.module.css';

interface BarProps{
    show:boolean;
    children:React.ReactNode;
}

const ButtonsBar:FC<BarProps> = ({show, children}) => {
    if(!show){
        return null;
    }

    return (
        <div className={styles.buttons}>
            {children}
        </div>
    );
};

export default ButtonsBar;