import React, {FC} from 'react';
import styles from "./marker.module.css";

export enum Position{
    TOP='top',
    LEFT='left'
}

interface MarkerProps{
    position:Position;
    children:React.ReactNode;
}

const Marker:FC<MarkerProps> = ({position,children})=>{
    return (
        <div className={`${styles.marker} ${styles[`${position}`]}`}>
            {children}
        </div>
    )
}

export default Marker;