import direction from "../classes/direction";

export default interface characterInterface {
    x: number,
    y: number,
    str: Function,
    underBlock: string,
    health: number, // whole number
    getHearts: Function,
    getNorthBlock: Function,
    getSouthBlock: Function,
    getWestBlock: Function,
    getEastBlock: Function,
    mine: Function,
    getBlockInFront: Function,
    direction: direction,

}