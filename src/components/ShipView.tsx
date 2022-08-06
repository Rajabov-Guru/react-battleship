import React, {FC, useEffect, useState} from 'react';
import {Direction, ShipType} from "../core/Ship";
import {useDrag} from "react-dnd";
import {getEmptyImage} from "react-dnd-html5-backend";
import Box from "./Box/Box";

interface ShipPlaceProps{
    type:ShipType;
    key:any;
    id:any;
}

const ShipView:FC<ShipPlaceProps> = ({type,id}) => {
    const [empty, setEmpty] = useState(false);


    const [{isDragging}, drag, preview] = useDrag(() => ({
        type: 'ship',
        item: {
            id:id,
            shipType:type
        },
        end:dragEnd,
        canDrag:!empty,
        collect: monitor => ({
            isDragging: !!monitor.isDragging()
        })
    }),[empty])

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true })
    }, [])

    useEffect(() => {
        if(isDragging) setEmpty(isDragging)
    }, [isDragging])


    // @ts-ignore
    function dragEnd(item, monitor){
        const didDrop = monitor.didDrop();
        if(didDrop){
            setEmpty(true);
        }
        else{
            setEmpty(false);
        }
    }


    return (
        <div ref={drag} style={{cursor: 'grab'}}>
            <Box type={type} empty={empty} direction={Direction.HORIZ} overlay={true}/>
        </div>
    );
};

export default ShipView;