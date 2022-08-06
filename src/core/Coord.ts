export default class Coord {
    y:number;
    x:number;

    constructor(y:number,x:number) {
        this.y=y;
        this.x=x;
    }

    public toString(){
        return `${this.y}:${this.x}`;
    }

    public isEqual(coord:Coord){
        if(this.y===coord.y && this.x===coord.x) return true;
        return false;
    }
}