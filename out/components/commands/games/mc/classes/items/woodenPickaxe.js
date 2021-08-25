"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emojis_1 = require("../../../../../utility/emojis");
const blockTypes_1 = require("../../enums/blockTypes");
const miningDifficultyEnum_1 = require("../../enums/miningDifficultyEnum");
const nullBlock_1 = require("./nullBlock");
class woodenPickaxe {
    constructor() {
        this.miningDifficulty = miningDifficultyEnum_1.default.STANDARD;
        this.blockType = blockTypes_1.default.WALK_OVER;
    }
    update(gameInstance) {
        console.log('updating');
    }
    toString() {
        return emojis_1.default.pickaxe;
    }
    use(gameInstance) {
        const block = gameInstance.character.getBlockInFront();
        if (block.miningDifficulty == miningDifficultyEnum_1.default.WOODEN_PICKAXE || block.miningDifficulty == miningDifficultyEnum_1.default.STANDARD)
            block.mine(gameInstance);
    }
    mine(gameInstance) {
    }
    setChoords(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    static craft(gameInstance) {
        // find the number of wood blocks in the inventory
        let count = 0;
        let woodIndex = [];
        for (let i = 0; i < gameInstance.character.inventory.length; i++) {
            if (gameInstance.character.inventory[i].toString() == emojis_1.default.brownSquare) {
                count++;
                woodIndex.push(i);
            }
        }
        console.log(count);
        if (count < 4)
            return;
        // get the first 4 wood indicies
        let woodIndiciesToUse = [];
        for (let i = 0; i < 4; i++) {
            woodIndiciesToUse.push(woodIndex[i]);
        }
        gameInstance.character.inventory.push(new woodenPickaxe());
        // remove 4 wood
        for (let i = 0; i < woodIndiciesToUse.length; i++) {
            gameInstance.character.inventory[woodIndiciesToUse[i]] = new nullBlock_1.default();
        }
        for (let i = 0; i < gameInstance.character.inventory.length; i++) {
            if (gameInstance.character.inventory[i].blockType == blockTypes_1.default.NULL_BLOCK) {
                gameInstance.character.inventory.splice(i, 1);
                i = 0;
            }
        }
    }
}
exports.default = woodenPickaxe;