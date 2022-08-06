import React, {FC, useEffect} from 'react';
import Cell, {CellStatus} from "../../core/Cell";
import styles from './cell.module.css'
import {useDrag, useDrop} from "react-dnd";
import {observer} from "mobx-react-lite";
import {ShipType} from "../../core/Ship";
import Overlay from "./Overlay/Overlay";
import Game from "../../store/Game";
import {getEmptyImage} from "react-dnd-html5-backend";
import Marker, {Position} from "./Marker/Marker";


interface CellProps{
    id:string;
    cell:Cell;
    updateBoard:(updateShips:boolean)=>void;
    canDragRop:boolean;
}

const CellView:FC<CellProps> = ({cell, id,updateBoard,canDragRop}) => {

    const [{ isOver, canDrop, item }, drop] = useDrop( //Логика дропа
        () => ({
            accept: 'ship',
            canDrop: canDropHandler,
            drop: dropHandler,
            collect: (monitor) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
                item: monitor.getItem()
            })
        }),[id]
    )
    // @ts-ignore
    function dropHandler(droppedItem, monitor):any{
        Game.dropShip(droppedItem.id, cell.coord);
    }
    // @ts-ignore
    function canDropHandler(droppedItem, monitor):any{
        // if(!canDragRop) return false;
        Game.canDropShip(droppedItem.id, cell.coord);
        return Game.canDrop;
    }


    const [{isDragging}, drag, preview] = useDrag(() => ({//Логика драга
        type: 'ship',
        item: {
            id:cell.ship?.id,
            shipType:cell.ship?.type,
            direction:cell.ship?.direction
        },
        end:dragEnd,
        canDrag:canDrag,
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    }),[cell.status,id, cell.ship])

    function canDrag(){
        // if(!canDragRop) return false;
        return cell.status===CellStatus.SHIP;
    }

    // @ts-ignore
    function dragEnd(item, monitor){
        const didDrop = monitor.didDrop();
        if(!didDrop){
            Game.returnBackShip();
        }
    }

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true })
    }, [])



    useEffect(() => {

        if(isDragging){
            if(cell.ship) {
                Game.setTargetShip(cell.ship);
                Game.setDraggingCellCoord(cell.ship.coord);
            }

            Game.removeShip(Game.targetShip.id);
            updateBoard(true);
        }
        else{
            Game.setTargetShip(null);
            Game.setDraggingCellCoord(null);
        }
    }, [isDragging])

    const changeShipDirection = ()=>{
        if(cell.status===CellStatus.SHIP && cell.ship){
            if(cell.ship.type===ShipType.SINGLE_DECK) return;
            Game.OwnBattleField.changeShipDirection(cell.ship.id);
            updateBoard(true);
        }
    }

    const shootTest = ()=>{
        if(cell.status===CellStatus.ENABLE){
            Game.setShootedCell(cell.coord);
            Game.sendShot(cell.coord);
        }
    }

   if(!canDragRop){
       return (
           <td className={`${styles.cell} ${styles[`${cell.status}`]}`} onClick={shootTest}>
               {cell.coord.y===0 && <Marker position={Position.TOP}>{String.fromCharCode(cell.coord.x+1*65)}</Marker>}
               {cell.coord.x===0 && <Marker position={Position.LEFT}>{cell.coord.y+1}</Marker>}
           </td>
       );
   }



    return (
        <td
            onDoubleClick={changeShipDirection}
            ref={(node) => drag(drop(node))}
            className={`${styles.cell} ${styles[`${cell.status}`]}`}>
            {cell.coord.y===0 && <Marker position={Position.TOP}>{String.fromCharCode(cell.coord.x+1*65)}</Marker>}
            {cell.coord.x===0 && <Marker position={Position.LEFT}>{cell.coord.y+1}</Marker>}
            {isOver && canDrop && <Overlay type={item.shipType} green={true} direction={item.direction}/>}
        </td>
    );
};

export default observer(CellView);