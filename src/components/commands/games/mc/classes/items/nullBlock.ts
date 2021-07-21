import Item from "../../interfaces/Item";
import emojis from "../../../../../utility/emojis";
import blockTypes from "../blockTypes";
import characterInterface from "../../interfaces/characterInterface";
import McGame from "../McGame";
import miningDifficultyEnum from "../miningDifficultyEnum";

export default class nullBlock implements Item {
    miningDifficulty: number = miningDifficultyEnum.WOODEN_PICKAXE
    blockType: blockTypes =  blockTypes.NULL_BLOCK
    x: number
    y: number
    setChoords (x: number, y: number): void {

    }
    toString(): string {
        return emojis.blackSquare
    }
    use(gameInstance: McGame): void {
        
    }
    mine(gameInstance: McGame): void {

    }
    update(gameInstance: McGame): void {

    }
}