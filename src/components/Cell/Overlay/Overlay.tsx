import React, {FC} from 'react';
import styles from "./overlay.module.css";
import Box from "../../Box/Box";
import {Direction, ShipType} from "../../../core/Ship";

interface OverlayProps{
    type:ShipType;
    green:boolean;
    direction:Direction;
}

const Overlay:FC<OverlayProps> = ({type,green,direction})=>{
    return (
        <div className={`${styles.overlay} ${green?styles.green:''}`}>
            <Box type={type} empty={true} direction={direction} overlay={true}/>
        </div>
    )
};

export default Overlay;