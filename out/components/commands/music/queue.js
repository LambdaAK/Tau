"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var queue_1;
Object.defineProperty(exports, "__esModule", { value: true });
const CommandClass_1 = require("../../classes/CommandClass");
const sendEmbed = require('./../../utility/embeds/sendEmbed');
const { lightBlue } = require('./../../utility/hexColors');
const { randomColor } = require('./.././../utility/hexColors');
let queue = queue_1 = class queue extends CommandClass_1.default {
    commandMain(message, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const playing = client.queueMap[message.guild.id]['playing']; // dict
            const serverQueue = client.queueMap[message.guild.id]['queue']; // array
            // make fields
            // add the playing song, immediately
            let fields = [{
                    name: 'Currently playing',
                    value: playing['songName']
                }];
            // add the rest of the queue
            for (let i = 0; i < serverQueue.length; i++) {
                if (serverQueue[i]['songName'] != undefined)
                    fields.push({
                        name: `${i + 2}:`,
                        value: serverQueue[i]['songName']
                    });
                else
                    fields.push({
                        name: `${i + 2}:`,
                        value: serverQueue[i]['playlistName']
                    });
            }
            // if there is a leading element in serverQueue, change the name
            if (fields[0] != undefined && fields[0] != null) {
                fields[0]['name'] = 'Currently Playing:';
            }
            let text = '\`\`\`css\n';
            for (let i = 0; i < fields.length; i++) {
                text += `${fields[i].name}: ${fields[i].value}\n`;
            }
            text = text.substring(0, 1990);
            text += '\`\`\`';
            let buttons = [];
            // buttons
            /*
             buttons.push(makeSkipButton())
             buttons.push(makeRestartButton())
             buttons.push(makeStopButton())
             buttons.push(makeQueueButton())
            */
            // working here
            /*
            const embed: MessageEmbed = makeEmbed({
                title: '** [Queue] **',
                color: defaultColor,
                fields: fields,
                deleteTimeout: 5000,
            })
            */
            message.channel.send(text, {
                buttons: buttons
            });
            return false;
        });
    }
};
queue.commandCategory = 'music';
queue.commandDescription = 'I show the current song queue';
queue.commandSyntax = 'queue';
queue = queue_1 = __decorate([
    queue_1.alias(['q']),
    queue_1.errorCheck([
        queue_1.CLIENT_NOT_IN_VC_ERR,
        queue_1.CLIENT_NOT_PLAYING_ANYTHING_ERR
    ])
], queue);
exports.default = queue;
