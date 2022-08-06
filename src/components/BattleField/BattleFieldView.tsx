import React, {FC} from 'react';
import styles from './battle_field.module.css';
import CellView from "../Cell/CellView";
import Game from "../../store/Game";
import {observer} from "mobx-react-lite";
import BattleField, {FieldType} from "../../core/BattleField";
import CustomDragLayer from "../CustomDrugLayer/CustomDragLayer";

interface FieldProps{
    type:FieldType;
    disabled:boolean;
}


const BattleFieldView:FC<FieldProps> = ({type,disabled}) => {

    const update =(updateShips:boolean):void=>{
        if(updateShips) Game.addShips();
        else Game.updateOwnBoard();
        Game.updateEnemyBoard();
    }

    function getBoard():BattleField{
        if(type===FieldType.OWN) return Game.OwnBattleField;
        return Game.EnemyBattleField;
    }

    function canDragDrop(){
        if(type===FieldType.OWN) return true;
        return false
    }

    return (
        <table className={`${styles.field} ${disabled && styles.disable}`}>
            <tbody>
            {getBoard().cells.map((row, index1)=>
                <tr key={index1}>
                    {
                        row.map((c)=>
                            <CellView id={c.coord.toString()} key={c.coord.toString()} cell={c} updateBoard={update} canDragRop={canDragDrop()}/>
                        )
                    }
                </tr>
            )}
            </tbody>
        </table>
    );
};

export default observer(BattleFieldView);