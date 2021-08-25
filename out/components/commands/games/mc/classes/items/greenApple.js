"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emojis_1 = require("../../../../../utility/emojis");
class greenapple {
    toString() {
        return emojis_1.default.greenApple;
    }
    use(gameInstance) {
        console.log('green apple use');
        gameInstance.character.incrementHunger();
        if (gameInstance.character.hunger > 10)
            gameInstance.character.hunger = 10;
        gameInstance.character.inventory.splice(Number(gameInstance.mostRecentMessage.content.split(' ')[1]), 1);
    }
    mine(gameInstance) {
    }
    setChoords(x, y) {
    }
    update(gameInstance) {
    }
}
exports.default = greenapple;