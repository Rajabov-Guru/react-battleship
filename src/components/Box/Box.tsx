import React, {FC} from 'react';
import {Direction, ShipType} from "../../core/Ship";
import styles from './box.module.css'


interface BoxProps{
    type:ShipType;
    empty:boolean;
    direction:Direction;
    overlay:boolean
}
const Box:FC<BoxProps> = ({type,empty,direction,overlay}) => {
    return (
        <div className={`${styles[`${type}`]} ${styles.box} ${styles[`${direction}`]} ${styles[`${empty?'empty':'not_empty'}`]} ${styles[`${overlay && empty?'inset_shadow':'shadow'}`]}`}></div>
    );
};

export default Box;