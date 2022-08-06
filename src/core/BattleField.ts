import Cell from "./Cell";
import Ship, {Direction, ShipType} from "./Ship";
import Coord from "./Coord";

export enum FieldType{
    OWN,
    ENEMY
}

export default class BattleField{
    type:FieldType;
    cells:Cell[][] = [];
    ships:Ship[] = [];
    coords:Coord[] = [];

    constructor(type:FieldType) {
        this.initCells();
        this.type = type;

        for(let y=0;y<10;y++){
            for(let x=0;x<10;x++){
                const coord = new Coord(y,x);
                this.coords.push(coord);
            }
        }
    }

    public checkGameOver(){
        return this.ships.every(x=>x.sinked);
    }

    public shoot(coord:Coord){
        const cell = this.getCell(coord);
        if(cell) {
            const shipId =  cell.shoot();
            if(shipId) {
                const ship = this.getShip(shipId);
                ship?.damage();
                return true;
            }
        }
        return false;
    }

    public openCell(coord:Coord,flag:boolean){
        const cell = this.getCell(coord);
        if(cell) {
            cell.open(flag);
        }
    }

    public getCopy(){
        const field = new BattleField(this.type);
        field.ships = this.ships;
        field.cells = this.cells;
        return field;
    }

    public initCells(){
        for (let i = 0; i < 10; i++) {
            const row: Cell[] = []
            for (let j = 0; j < 10; j++) {
                row.push(new Cell(i, j))
            }
            this.cells.push(row);
        }
    }

    public removeCoord(coord:Coord){
        this.coords = this.coords.filter(c=>!c.isEqual(coord));

        this.coords = this.coords.filter(c=>!c.isEqual(new Coord(coord.y+1,coord.x)));//bottom
        this.coords = this.coords.filter(c=>!c.isEqual(new Coord(coord.y,coord.x+1)));//right
        this.coords = this.coords.filter(c=>!c.isEqual(new Coord(coord.y-1,coord.x)));//top
        this.coords = this.coords.filter(c=>!c.isEqual(new Coord(coord.y,coord.x-1)));//left

        this.coords = this.coords.filter(c=>!c.isEqual(new Coord(coord.y+1,coord.x-1)));//bottom-left
        this.coords = this.coords.filter(c=>!c.isEqual(new Coord(coord.y+1,coord.x+1)));//bottom-right
        this.coords = this.coords.filter(c=>!c.isEqual(new Coord(coord.y-1,coord.x+1)));//top-left
        this.coords = this.coords.filter(c=>!c.isEqual(new Coord(coord.y-1,coord.x+1)));//left
    }

    public generateBoard(){
        this.generateShips(ShipType.FOUR_DECK, 1);
        this.generateShips(ShipType.THREE_DECK, 2);
        this.generateShips(ShipType.DOUBLE_DECK, 3);
        this.generateShips(ShipType.SINGLE_DECK, 4);
    }

    public generateShips(type:ShipType,count:number){
        for(let i=0;i<count;i++){
            let ship = this.generateShip(type);

            do{
                ship = this.generateShip(type);
            }
            while(!this.canBeAdded(ship.coord, ship));

            this.ships.push(ship);
            this.addShips();
        }
    }

    public generateShip(type:ShipType):Ship{
        let id = this.ships.length>0?this.ships[this.ships.length-1].id+1:1;
        const ship = new Ship(type, id);
        ship.direction = this.getRandomDirection();
        ship.coord = this.getRandomCoord();
        return ship;
    }

    public getRandomDirection():Direction{
        let index = Math.floor(Math.random() * 2);
        return Object.values(Direction)[index];
    }

    public getRandomCoord():Coord{
        let index = Math.floor(Math.random() * this.coords.length);
        return this.coords[index];
    }

    public getCell(coord:Coord) {
        if(coord.y>=0 && coord.y<=9 && coord.x>=0 && coord.x<=9){
            return this.cells[coord.y][coord.x]
        }
        else{
            return null;
        }

    }
    public getShip(id:number) {
        const ship =  this.ships.filter(sh=>sh.id ===  id);
        if(ship.length>0) return ship[0];
        return null;

    }

    public removeShip(id:number | null){
        for(let i=0;i<this.cells.length;i++){
            let row = this.cells[i];
            for(let j=0;j<row.length;j++){
                const cell = row[j];
                if(cell.ship?.id && cell.ship.id === id){
                    cell.removeShip();
                }
            }
        }
        this.ships = this.ships.filter(x=>x.id!==id);
    }

    public changeShipDirection(id:number){
        const ship = this.getShip(id)?.getCopy();
        const oldShip = this.getShip(id)?.getCopy();
        if(ship){
            ship.changeDirection();
            this.removeShip(ship.id);
            if(this.canBeAdded(ship.coord,ship)){
                this.ships.push(ship);
            }
            else{
                if(oldShip) this.ships.push(oldShip)
            }

        }
    }

    public addShips(){
        for(let ship of this.ships){
            this.addOneShip(ship);
        }
    }

    public addOneShip(ship:Ship){
        let length = ship.getLength();
        const coord = ship.coord;
        if(ship.direction==Direction.HORIZ)
        {
            for(let i=0;i<length;i++){
                const c = new Coord(coord.y,coord.x+i);
                this.removeCoord(c);
                this.setShipToCell(c,ship);
            }
        }
        else{
            for(let i=0;i<length;i++){
                const c = new Coord(coord.y+i,coord.x);
                this.removeCoord(c);
                this.setShipToCell(c,ship);
            }
        }

    }

    public setShipToCell(coord:Coord, ship:Ship){
        const cell = this.getCell(coord);
        if(cell){
            cell.addShip(ship);
        }
    }



    public canBeAdded(coord:Coord,ship:Ship){
        let length = ship.getLength();
        let lastRowNumber = ship.direction==Direction.VERT?coord.y+length-1:coord.y;
        let lastCellNumber = ship.direction==Direction.VERT?coord.x:coord.x+length;

        for(let i = coord.y;i<=lastRowNumber;i++){
            for(let j = coord.x;j<=lastCellNumber;j++){
                const c = this.getCell(new Coord(i,j));
                if(c && !c.isEnable()){
                    return false;
                }
            }
        }

        let checBorder = ship.direction==Direction.VERT?coord.y+length-1:coord.x+length-1;
        if(checBorder>9) return false;

        lastRowNumber = ship.direction==Direction.VERT?coord.y+length:coord.y+1;
        lastCellNumber = ship.direction==Direction.VERT?coord.x+1:coord.x+length;


        for(let j = coord.x-1;j<=lastCellNumber;j++){
            const cTop = this.getCell(new Coord(coord.y-1,j));
            if(cTop && cTop.isShip()){
                return false;
            }
            const cBottom = this.getCell(new Coord(lastRowNumber,j));
            if(cBottom && cBottom.isShip()){
                return false;
            }
        }

        for(let j = coord.y-1;j<lastRowNumber;j++){

            const cLeft = this.getCell(new Coord(j,coord.x-1));
            if(cLeft && cLeft.isShip()){
                return false;
            }

            let x = ship.direction===Direction.VERT?coord.x+1:coord.x+length;
            const cRight = this.getCell(new Coord(j,x));
            if(cRight && cRight.isShip()){
                return false;
            }
        }
        return true;
    }



}