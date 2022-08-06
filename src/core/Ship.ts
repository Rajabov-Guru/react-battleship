import Coord from "./Coord";

export enum ShipType {
    SINGLE_DECK = 'single',
    DOUBLE_DECK = 'double' ,
    THREE_DECK  = 'three',
    FOUR_DECK = 'four'
}

export enum Direction{
    VERT='vert',
    HORIZ='horiz'
}

export default class Ship {
    type:ShipType = ShipType.SINGLE_DECK;
    id:number;
    coord:Coord = new Coord(0,0);
    lives:number = 0;
    sinked:boolean = false;
    direction:Direction = Direction.HORIZ;

    constructor(type:ShipType, id:number) {
        this.type = type;
        this.id = id;
        this.lives = this.getLength();
    }

    public getCopy(){
        const ship = new Ship(this.type, this.id);
        ship.direction = this.direction;
        ship.coord = this.coord;
        ship.sinked = this.sinked;
        return ship;
    }

    public getLength(){
        switch (this.type){
            case ShipType.SINGLE_DECK:
                return 1;
            case ShipType.DOUBLE_DECK:
                return 2;
            case ShipType.THREE_DECK:
                return 3;
            case ShipType.FOUR_DECK:
                return 4;
        }
    }

    public damage(){
        if(!this.sinked){
            this.lives -= 1;
            if(this.lives===0) this.sinked = true;
            // console.log(`${this.id}:${this.sinked}`)
        }

    }

    public changeDirection(){
        if(this.direction===Direction.HORIZ){
            if(this.coord.y+this.getLength()-1<=9) this.direction = Direction.VERT;
        }
        else{
            if(this.coord.x+this.getLength()-1<=9) this.direction = Direction.HORIZ
        }
    }

}