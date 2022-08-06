import React, {FC} from 'react';
import styles from './button.module.css';

interface ButtonProps{
    disabled:boolean;
    clickHandler:()=>void;
    children:React.ReactNode;
}

const MyButton:FC<ButtonProps> = ({disabled,clickHandler, children}) => {
    return (
        <button disabled={disabled} onClick={clickHandler} className={styles.button}>
            {children}
        </button>
    );
};

export default MyButton;