import React, {FC} from 'react';
import styles from './message.module.css';

export enum MessageType{
    CONNECTION = 'Cоединение...',
    LOSTCONNECTION='Нет соединения',
    ERROR = 'Ошибка',
    WAITING = 'Ждём противника',
    YOURSHOT = 'Ваш ход',
    ENEMYSHOT = 'Ход противника',
    WIN='Поздравляем, вы выиграли!',
    LOSE='К сожалению ваш флот был уничтожен',

}

function getClassname(type:MessageType){
    switch (type) {
        case MessageType.CONNECTION:
            return styles.connection;
            break;
        case MessageType.LOSTCONNECTION:
            return styles.lost_connection;
            break;
        case MessageType.ERROR:
            return styles.error;
            break;
        case MessageType.WAITING:
            return styles.waiting;
            break;
        case MessageType.YOURSHOT:
            return styles.your_shot;
            break;
        case MessageType.ENEMYSHOT:
            return styles.enemy_shot;
            break;
        case MessageType.WIN:
            return styles.win;
            break;
        case MessageType.LOSE:
            return styles.lose;
            break;

    }
}

interface MessageProps{
    content:MessageType;
}

const Message:FC<MessageProps> = ({content}) => {
    return (
        <div className={`${styles.message} ${getClassname(content)}`}>
            {content}
        </div>
    );
};

export default Message;