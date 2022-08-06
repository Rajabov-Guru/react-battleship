import {makeAutoObservable} from "mobx";
import BattleField, {FieldType} from "../core/BattleField";
import Ship from "../core/Ship";
import Fleet from "../core/Fleet";
import Coord from "../core/Coord";
import {MesType} from "../components/MainPage";
import {MessageType} from "../components/UI/Message/Message";

class Game {
    socket:any = null;
    gameId:string = '';
    userId:string = '';

    OwnBattleField:BattleField = new BattleField(FieldType.OWN);
    EnemyBattleField:BattleField = new BattleField(FieldType.ENEMY);
    targetShip:(Ship | any) = null;
    fleet:Fleet = new Fleet();
    fleetCount:number = 10;

    draggingCellCoord:(Coord | any) = null;

    canDrop:boolean = false;
    canStart:boolean = true;
    handPlacing:boolean = false;

    start:boolean = false;
    over:boolean = false;

    message:MessageType = MessageType.CONNECTION;
    canShot:boolean = false;

    shootedCell:Coord | null = null;

    constructor(){
        makeAutoObservable(this);
    }

    setShootedCell(value:Coord){
        this.shootedCell = value;
    }

    setCanShot(value:boolean){
        this.canShot = value;
    }

    setSocket(sock:any){
        this.socket = sock;
    }

    setGameId(value:string){
        this.gameId = value;
    }

    setUserId(value:string){
        this.userId = value;
    }

    setMessage(value:MessageType){
        this.message = value;
    }

    setFleetCount(value:number){
        this.fleetCount = value;
    }

    setStart(value:boolean){
        this.start = value;
    }

    setOver(value:boolean){
        this.over = value;
    }

    setHandPlacing(value:boolean){
        this.handPlacing =value;
    }

    setCanStart(value:boolean){
        this.canStart = value;
    }

    setFleet(value:Fleet){
        this.fleet = value;
    }

    setCanDrop(value:boolean){
        this.canDrop = value;
    }


    setTargetShip(value:Ship | null){
        this.targetShip=value;
    }

    setOwnBattleField(value:BattleField){
        this.OwnBattleField = value;
    }

    setEnemyBattleField(value:BattleField){
        this.EnemyBattleField = value;
    }

    setDraggingCellCoord(value:Coord | any){
        this.draggingCellCoord = value;
    }

    updateOwnBoard(){
        const newBoard = this.OwnBattleField.getCopy();
        this.setOwnBattleField(newBoard);
    }

    updateEnemyBoard(){
        const newBoard = this.EnemyBattleField.getCopy();
        this.setEnemyBattleField(newBoard);
    }

    updateFleet(){
        const fleet = new Fleet();
        this.setFleet(fleet);
    }

    restart(){
        const ownBoard = new BattleField(FieldType.OWN);
        ownBoard.generateBoard();
        const enemyBoard = new BattleField(FieldType.OWN);
        this.setOwnBattleField(ownBoard);
        this.setEnemyBattleField(enemyBoard);
        this.setStart(false);
        this.setOver(false);
        this.setHandPlacing(false);
        this.updateFleet();
    }

    generateOn(){
        this.setFleetCount(10);
        this.setHandPlacing(false);
        this.setCanStart(true);
    }

    handPlacingOn(){
        this.setHandPlacing(true);
        this.setCanStart(false);
        this.updateFleet();
    }

    addShips(){
        const newBoard = this.OwnBattleField.getCopy();
        newBoard.addShips();
        this.setOwnBattleField(newBoard);
    }



    canDropShip(id:number, coord:Coord){
        let ship = null;
        if(this.targetShip){
            ship = this.targetShip.getCopy();
        }
        else{
            const ships = this.fleet.ships.filter(x=>x.id===id);
            if(ships.length>0){
                ship = ships[0].getCopy();
            }
        }
        this.setCanDrop(this.OwnBattleField.canBeAdded(coord, ship));
    }

    dropShip(id:number, coord:Coord){
        let ship = null;
        if(this.targetShip){
            ship = this.targetShip.getCopy();
        }
        else{
            const ships = this.fleet.ships.filter(x=>x.id===id);
            this.setFleetCount(this.fleetCount-1);
            this.setCanStart(this.fleetCount===0);
            if(ships.length>0){
                ship = ships[0].getCopy();
            }
        }
        ship.coord = coord;
        this.OwnBattleField.ships.push(ship);
        this.addShips();
    }

    removeShip(id:number){
        this.OwnBattleField.removeShip(id);
    }

    returnBackShip(){
        this.OwnBattleField.ships.push(this.targetShip);
        this.addShips();
    }

    changeCanShot(value:boolean){
        if(value){
            this.setCanShot(true);
            this.setMessage(MessageType.YOURSHOT);
        }
        else{
            this.setCanShot(false);
            this.setMessage(MessageType.ENEMYSHOT);
        }
    }

    sendShot(coord:Coord){
        this.setCanShot(false);
        const mes = {
            method: MesType.SHOT,
            gameId:this.gameId,
            userId:this.userId,
            coord:coord
        };
        this.socket.send(JSON.stringify(mes));
    }

    getShot(coord:Coord){
        const result = this.OwnBattleField.shoot(coord);
        this.changeCanShot(!result);
        const mes = {
            method: MesType.SHOTRESULT,
            gameId:this.gameId,
            userId:this.userId,
            result:result
        };
        this.socket.send(JSON.stringify(mes));
        this.setOver(this.OwnBattleField.checkGameOver());
        this.updateOwnBoard();
    }

    showShotResult(result:boolean){
        if(this.shootedCell) this.EnemyBattleField.openCell(this.shootedCell,result);
        this.updateEnemyBoard();
    }

    sendWin(){
        this.setCanShot(false);
        const mes = {
            method: MesType.WIN,
            gameId:this.gameId,
            userId:this.userId
        }
        this.socket.send(JSON.stringify(mes));
        this.setMessage(MessageType.LOSE);
        this.breakConnection();
    }

    win(){
        this.setCanShot(false);
        this.setMessage(MessageType.WIN);
        setTimeout(()=>{
            this.restart();
            this.breakConnection();
        },1500);
    }

    breakConnection(){
        this.socket.close();
        this.setSocket(null);
    }

}

export default new Game();