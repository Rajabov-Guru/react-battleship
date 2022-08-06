import React, {useRef, useState} from 'react';
import styles from './fleet.module.css';
import {ShipType} from "../../core/Ship";
import ShipView from "../ShipView";
import Game from "../../store/Game";
import {observer} from "mobx-react-lite";

const FleetView = () => {



    return (
        <div className={styles.fleet_box_root}>
            {Object.values(ShipType).reverse().map(shipType=>
                <div key={shipType} className={styles.fleet_item_box}>
                    {Game.fleet.getShipsByType(shipType).map(sh=>
                        <ShipView type={shipType} id={sh.id} key={sh.id}></ShipView>
                    )}
                </div>
            )}
        </div>

    );
};

export default observer(FleetView);