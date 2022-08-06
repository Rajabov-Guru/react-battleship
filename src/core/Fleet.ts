import Ship, {ShipType} from "./Ship";

class FleetShip{
    current:Ship;
    count:number;
    constructor(ship:Ship) {
        this.current = ship;

        switch (ship.type) {
            case ShipType.SINGLE_DECK:
                this.count = 4;
                break;
            case ShipType.DOUBLE_DECK:
                this.count = 3;
                break;
            case ShipType.THREE_DECK:
                this.count = 2;
                break;
            case ShipType.FOUR_DECK:
                this.count = 1;
                break;
        }
    }
}

export default  class Fleet {
    ships: Ship[] = [];

    constructor() {
        for(let i = 1;i<5;i++){
            this.ships.push(new Ship(ShipType.SINGLE_DECK, i));
        }
        for(let i = 5;i<8;i++){
            this.ships.push(new Ship(ShipType.DOUBLE_DECK, i));
        }
        for(let i = 8;i<10;i++){
            this.ships.push(new Ship(ShipType.THREE_DECK, i));
        }
        this.ships.push(new Ship(ShipType.FOUR_DECK, 10));
    }

    getShipsByType(type:ShipType){
        return this.ships.filter(x=>x.type===type);
    }

    removeShip(id:number){
        this.ships = this.ships.filter(x=>x.id!==id);
    }

    isEmpty(){
        return this.ships.length===0;
    }
}