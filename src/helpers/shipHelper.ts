import Cell from "../core/Cell";
import BattleField from "../core/BattleField";
import {ShipType} from "../core/Ship";
import {XYCoord} from "react-dnd";

export default class ShipHelper {
    public static getType(code:any):ShipType{
        switch (code) {
            case 'single':
                return ShipType.SINGLE_DECK;
            case 'double':
                return ShipType.DOUBLE_DECK;
            case 'three':
                return ShipType.THREE_DECK;
            case 'four':
                return ShipType.FOUR_DECK;
            default:
                return ShipType.FOUR_DECK;

        }
    }

    public static getItemStyles(initialOffset: XYCoord | null, currentOffset: XYCoord | null) {
        if (!initialOffset || !currentOffset) {
            return {
                display: 'none',
            }
        }
        let { x, y } = currentOffset

        const transform = `translate(${x}px, ${y}px)`

        return {
            transform,
            WebkitTransform: transform,
        }
    }
}