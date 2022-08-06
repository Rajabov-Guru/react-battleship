import React, {useEffect, useState} from 'react';
import BattleFieldView from "./BattleField/BattleFieldView";
import BattleField, {FieldType} from "../core/BattleField";
import CustomDragLayer from "./CustomDrugLayer/CustomDragLayer";
import Game from "../store/Game";
import {observer} from "mobx-react-lite";
import {useParams} from "react-router-dom";
import FleetView from "./Fleet/FleetView";
import MyButton from "./UI/Button/MyButton";
import ButtonsBar from "./UI/ButtonsBar/ButtonsBar";
import Message, {MessageType} from "./UI/Message/Message";

export enum MesType{
    CONNECT='connection',
    START = 'start',
    SHOT = 'shot',
    SHOTRESULT = 'shotresult',
    WIN = 'win',
}

const MainPage = () => {
    const [url, setUrl] = useState('');
    const {key} = useParams();

    useEffect(()=>{
        setUrl(window.location.href);
        Game.restart();
        if(key) Game.setGameId(key);
        Game.setUserId((+new Date()).toString());
    },[])



    useEffect(()=>{
        if(!Game.socket && Game.start){
            const socket = new WebSocket("ws://test-sea-battle.na4u.ru/");
            // const socket = new WebSocket("ws://test-sjea-battle.na4u.ru/");
            socket.onopen = ()=> {
                console.log("Соединение установлено.");
                const mes = {
                    method: MesType.CONNECT,
                    gameId:Game.gameId,
                    userId:Game.userId
                };
                socket.send(JSON.stringify(mes));
                Game.setMessage(MessageType.WAITING);
            };

            socket.onmessage = (event)=> {
                const mes = JSON.parse(event.data);
                switch (mes.method) {
                    case MesType.CONNECT:
                        Game.changeCanShot(true);
                        const response = {
                            method: MesType.START,
                            gameId:Game.gameId,
                            userId:Game.userId
                        }
                        socket.send(JSON.stringify(response));
                        break;
                    case MesType.START:
                        Game.changeCanShot(false);
                        break;
                    case MesType.SHOT:
                        Game.getShot(mes.coord);
                        break;
                    case MesType.SHOTRESULT:
                        Game.changeCanShot(mes.result);
                        Game.showShotResult(mes.result);
                        break;
                    case MesType.WIN:
                        Game.win();
                        break;

                }

            };

            socket.onclose = (event)=>{
                console.log('Соединение закрыто');
                Game.setMessage(MessageType.LOSTCONNECTION);
            };
            socket.onerror = (error)=> {
                console.log("Ошибка " + error);
                Game.setMessage(MessageType.LOSTCONNECTION);
            };

            Game.setSocket(socket);
        }

    },[Game.start]);



    useEffect(()=>{
        if(Game.over){
            Game.sendWin();
            setTimeout(()=>{
                Game.restart();
            },1500);
        }
    },[Game.over])


    function generate(){
        Game.generateOn();
        Game.restart();
    }

    function handPlacingClick(){
        Game.handPlacingOn()
        const ownBoard = new BattleField(FieldType.OWN);
        Game.setOwnBattleField(ownBoard);
    }

    function startGame(){
        Game.setStart(true);
        Game.setMessage(MessageType.CONNECTION);
    }



    return (
        <div className="main">
            <div className={'layout'}>
                {Game.start && <Message content={Game.message}/>}
                {Game.handPlacing && !Game.start &&
                <div className={'wrapper'}>
                    <FleetView/>
                    <p className={'explain'}>Перетащите корабли. <br/>Двойное нажатие ПКМ по кораблю <br/>изменит направление корабля</p>
                </div>}

                <div className={'wrapper'}>
                    <BattleFieldView type={FieldType.OWN} disabled={Game.start}/>
                    <CustomDragLayer/>
                    {Game.start && <div className={'subtitle'}>Ваше поле</div>}
                    <ButtonsBar show={!Game.start}>
                        <MyButton disabled={false} clickHandler={generate}>Рандомно</MyButton>
                        <MyButton disabled={Game.handPlacing} clickHandler={handPlacingClick}>С нуля</MyButton>
                        <MyButton disabled={!Game.canStart} clickHandler={startGame}>Играть</MyButton>
                    </ButtonsBar>
                </div>
                {Game.start &&
                    <div className={'wrapper'}>
                        <BattleFieldView type={FieldType.ENEMY} disabled={!Game.canShot}/>
                        {Game.start && <div className={'subtitle'}>Поле противника</div>}
                    </div>
                }

                {!Game.start &&
                    <div className={'wrapper'}>
                        <div className={'explain'}>Отправьте ссылку ниже другу, для подключения )</div>
                        <div className={'url'}>{url}</div>
                    </div>
                }

            </div>
        </div>
    );
};

export default observer(MainPage);