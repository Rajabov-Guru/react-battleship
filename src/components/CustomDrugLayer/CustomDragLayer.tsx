import React from 'react';
import {useDragLayer} from "react-dnd";
import Box from "../Box/Box";
import ShipHelper from "../../helpers/shipHelper";
import styles from './layer.module.css'
import {Direction} from "../../core/Ship";

const CustomDragLayer = () => {

    const { itemType, isDragging, item, initialOffset, currentOffset } =
        useDragLayer((monitor) => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging()
    }))


    if(!isDragging){
        return null;
    }

    return (
        <div className={styles.layer}>
            <div style={ShipHelper.getItemStyles(initialOffset, currentOffset)}>
                <Box type={ShipHelper.getType(item.shipType)} empty={false} direction={item.direction?item.direction:Direction.HORIZ} overlay={false}/>
            </div>
        </div>
    );
};

export default CustomDragLayer;