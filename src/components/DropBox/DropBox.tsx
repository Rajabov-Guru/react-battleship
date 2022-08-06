import React, {FC,useState} from 'react';
import styles from './dropbox.module.css';
import {useDrop} from "react-dnd";
import {ShipType} from "../../core/Ship";

interface DropBoxProps{
    type:ShipType
}

const DropBox:FC<DropBoxProps> = ({type}) => {
    const [content, setContent]  =  useState('');
    const [{ isOver, canDrop }, drop] = useDrop(
        () => ({
            accept: type,
            canDrop: () => content.length===0,
            drop: dropHandler,
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop()
            })
        }),[content]
    )

    // @ts-ignore
    function dropHandler(droppedItem, monitor):any{
        setContent('dropped');
        const dragData = monitor.getItem();
        return dragData;
    }

    return (
        <div ref={drop} className={`${styles[`${type}_placeholder`]} ${styles.box} ${canDrop && isOver?styles.can_drop:!canDrop && isOver?styles.cant_drop:''}`}>
            {content}
        </div>
    );
};

export default DropBox;