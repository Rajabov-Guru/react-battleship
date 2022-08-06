import Coord from "./Coord";
import Ship from "./Ship";

export enum CellStatus{
    ENABLE='enable',
    BESIDE = 'beside',
    BINGO = 'bingo',
    DISABLE= 'disable',
    HOVERING = 'hovering',
    SHIP = 'ship'

}

export default class Cell{
    coord:Coord;
    ship:(Ship | null) = null;
    status:CellStatus = CellStatus.ENABLE;

    constructor(y:number, x:number){
        const coord = new Coord(y,x);
        this.coord = coord;
    }

    public addShip(ship:Ship){
        this.ship = ship;
        this.status = CellStatus.SHIP;
    }

    public shoot(){
        if(this.status===CellStatus.SHIP) {
            this.status = CellStatus.BINGO;
            if(this.ship) return this.ship.id;
        }
        else this.status = CellStatus.BESIDE;
        return null;
    }

    public open(flag:boolean){
        if(flag) this.status = CellStatus.BINGO;
        else this.status = CellStatus.BESIDE;
    }

    public removeShip(){
        this.ship = null;
        this.status = CellStatus.ENABLE;
    }

    public isEnable(){
        return this.status == CellStatus.ENABLE;
    }

    public isDisable(){
        return this.status == CellStatus.DISABLE;
    }

    public isShip(){
        return this.status == CellStatus.SHIP;
    }


}