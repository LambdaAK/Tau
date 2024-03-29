import { DMChannel, Guild, GuildMember, Message, Embed, NewsChannel, TextChannel, EmbedBuilder, BaseInteraction, ChatInputCommandInteraction } from "discord.js"

import * as errorClasses from "./Errors.js"
import Tau from '../../index.js'
import {ERROR, ERROR_METACLASS} from './Errors.js'
import errorColor from "../utility/embeds/errorColor.js"
import defaultColor from "../utility/embeds/defaultColor.js"
import fs from 'fs'

/* make the err list definable as a static property of the CommandClass subclass, then use .class to
retrieve the class. After, use that to call CommandClass.constructor (super, in context).
*/


import sendEmbed from './../utility/embeds/sendEmbed.js'


export default abstract class CommandClass {
    // NOTE: Since CommandClass is defined as a public abstract (async) method, and all subclasses of Command class are
        // meant to be static, it must be called as <class>.prototype.commandMain(message, client)

    static CLIENT_NOT_IN_VC_ERR: ERROR = errorClasses.CLIENT_NOT_IN_VC_ERR
    static CLIENT_NOT_PLAYING_ANYTHING_ERR: ERROR = errorClasses.CLIENT_NOT_PLAYING_ANYTHING_ERR
    static MEMBER_NOT_IN_VC_ERR: ERROR = errorClasses.MEMBER_NOT_IN_VC_ERR
    static PLAYING_SONG_ALREADY_LOOPING_ERR: ERROR = errorClasses.PLAYING_SONG_ALREADY_LOOPING_ERR
    static CLIENT_ALREADY_IN_VC_ERR: ERROR = errorClasses.CLIENT_ALREADY_IN_VC_ERR
    static MEMBER_IN_DIFFERENT_VC_THAN_CLIENT_ERR: ERROR = errorClasses.MEMBER_IN_DIFFERENT_VC_THAN_CLIENT_ERR
    static QUANTATIVE_RANGE_ERR_METACLASS: ERROR_METACLASS = errorClasses.QUANTATIVE_RANGE_ERR_METACLASS
    static MISSING_ARGS_ERR_METACLASS: ERROR_METACLASS = errorClasses.MISSING_ARGS_ERR_METACLASS
    static MEMBER_ALREADY_MUTED_ERR: ERROR = errorClasses.MEMBER_ALREADY_MUTED_ERR
    static MEMBER_ALREADY_UNMUTED_ERR: ERROR = errorClasses.MEMBER_ALREADY_UNMUTED_ERR
    static USER_NOT_PLAYING_A_GAME_ERR: ERROR = errorClasses.USER_NOT_PLAYING_A_GAME_ERR
    static USER_ALREADY_PLAYING_GAME_ERR: ERROR = errorClasses.USER_ALREADY_PLAYING_GAME_ERR
    
    // default values
    protected static commandCategory: string = 'misc'
    protected static commandDescription: string = ''
    protected static commandSyntax: string = ''


    public abstract /*async*/ commandMain(interaction: ChatInputCommandInteraction, client: Tau): Promise<any>
    // can be overriden
    protected static aliases: string[] = []
    // decorator factory
    protected static errorCheck: Function = function (errorsToCheck: ERROR|ERROR_METACLASS[]) {
    
        const checkErr = (interaction: ChatInputCommandInteraction): boolean => {
            let errPresent = false
            // instantiated a an object of class of superclass ErrorClass, which checks if the error is present
            for (let i = 0; i < errorsToCheck.length; i++) {
                const errBeingChecked = new errorsToCheck[i](interaction)
                if (errBeingChecked.checkPresence(interaction) == true) {
                    errPresent = true
                    errBeingChecked.standardHandle(interaction)
                    break
                }
            }
            return errPresent
        }
    
        // the decorator
        return function(commandConstructor: Function) {
            // the nondecorated commandMain method
            const oldCommandMain = commandConstructor.prototype.commandMain
    
            const newCommandMain: Function = async function(message: Message, client: Tau) {
                if (checkErr(message) == false) {
                    oldCommandMain(message, client)
                    return false
                }
                else return true
            }
    
            // modify the commandMain method
            commandConstructor.prototype.commandMain = newCommandMain
        }
    }
    
    // misc methods
    protected static splitArgs(message: Message){
            return message.content.split(' ')
    }
    protected static splitArgsWithoutCommandCall(message: Message){
        const args = message.content.split(' ')
        args.shift()
        return args
    }

    protected static removePrefixFromString(s: string, prefix: string) {
        return s.substring(prefix.length + 2)
    }
    protected static removePrefixAndCommandFromString(s: string, prefix: string) {
        return s.substring(s.indexOf(' ') + 1)
    }

    protected static sendErrMessage(channel: TextChannel | NewsChannel | DMChannel, errMessage: string) {
        sendEmbed(channel, {
            title: errMessage,
            color: errorColor,
            deleteTimeout: 5000

        })

    }

    protected static sendEmbed(channel: TextChannel|DMChannel, kwargs: any) {
        // message is a discord.message, kwargs is a dictionary
    
        let embed = new EmbedBuilder()
        /*if (kwargs['color'])*/ embed.setColor(defaultColor)
        if (kwargs['title']) embed.setTitle(`${kwargs['title']}`)
        if (kwargs['image']) embed.setImage(`${kwargs['image']}`)
    
        // the elements in kwargs['fields'] are dictionaries
        if(kwargs['fields']) {////////////////////////////////////////////////////////////////
    
            for (let i = 0; i < kwargs['fields'].length; i++) {
                const name = kwargs['fields'][i]['name']
                const value = kwargs['fields'][i]['value']
                embed.addFields({
                   name: name,
                   value: value,
                   inline: false
                })
            }
        }
        
    
    
    
        // default timeout for delete if 5 seconds. Can be changed or removed comepletely.
        //let deleteTimeout = 5000
        //if (kwargs['deleteTimeout']) {
        //    console.log('deleteTimeout')
        //    console.log(kwargs['deleteTimeout'])
        //    if (kwargs['deleteTimeout'] == false) deleteTimeout = undefined
        //    else if (typeof kwargs['deleteTimeout'] == Number) timeout = kwargs['deleteTimeout']
        
    
        embed.setTimestamp()
        
     
        // sends the embed message, then returns a promise that resolves to the message.
        const sentMessagePromise = channel.send({embeds: [embed]})
        // if there's a deleteTimeout specified
        sentMessagePromise
        .then((message) => {
            if (kwargs['deleteTimeout']) {
                setTimeout(function() {
                    message.delete()
                }, kwargs['deleteTimeout'])
            }
        })
    
        return sentMessagePromise
    
        
    
    }


    
    protected static HEADDEVELOPER = 884227120547651604
    protected static ADMIN = 848001679801712650
    protected static MOD = 843991898708246558
    protected static DEVELOPER = 849334166717071420

    protected static MUTED = 848386357708849152

    protected static STAFF = [CommandClass.HEADDEVELOPER, CommandClass.ADMIN, CommandClass.MOD]


    // decorator factory
    protected static role(roles: number[]) {
        // return the decorator
        return function(target: any) {
            // define the newCommandMain method
            const oldCommandMain = target.prototype.commandMain
            const newCommandMain: Function = async (message: Message, client: Tau) => {
                const commandName = message.content.split(' ')[0].substring(1)
                    console.log('checking roles')
                        let rolePresent = false
                        for (let i = 0; i < roles.length; i++) {
                            if (message.member.roles.cache.find(role => Number(role.id) == roles[i])) rolePresent = true
                        }

                        if (rolePresent) oldCommandMain(message, client)
                        else sendEmbed(message.channel, {
                            title: `You do not have the required permissions to use the ${commandName} command, ${message.author.tag}.`,
                            color: errorColor,
                            deleteTimeout: 5000,
                        })
                    }

            // edit the method
            target.prototype.commandMain = newCommandMain

        }
            
    }

    protected static unStable(target: any) {
        const oldCommandMain = target.prototype.commandMain

        const newCommandMain = async (message: Message, client: Tau) => {
            if (message.author.id == '864397915174862860') oldCommandMain(message, client)
            else sendEmbed(message.channel,{
                title: `This command is unstable. At this time, only Developer qt may use this command`,
                color: errorColor,
                deleteTimout: 5000
            })

            target.prototype.commandMain = newCommandMain
        }
    }

    protected static getMember(id: string, guild: Guild): GuildMember {
        console.log(`ID: ${id}`)
        console.log(`GUILD: ${guild}`)
        const member: GuildMember = guild.members.cache.get(id)
        return member
    }

    protected static SPECIAL(target: any) {
        const oldCommandMain = target.prototype.commandMain

        const newCommandMain = async (message: Message, client: Tau) => {
            if (message.author.id == '536235243938643998') oldCommandMain(message, client)
            target.prototype.commandMain = newCommandMain
        }
    }

    protected static alias(aliases: string[]) {
        return function (target: any) {

            target.aliases = aliases

        }
    }

    // for currency
    protected static modifyBalance(memberId: string, amount: number): boolean {
        const wallets = require('./../../../data/wallets.json')

        //check if there is a wallet for the memberId
        if (wallets[memberId] == undefined) return false;

        wallets[memberId] += amount
        const jsonString: string = JSON.stringify(wallets)
        const logPath = require('path').resolve(__dirname, './../../../data/wallets.json')

        fs.writeFile(logPath, jsonString, err => {
            if (err) {
              console.error(err)
              return
            }
            //file written successfully
        })


    }


    // for currency
    protected static stealCoin(recipientId: string, victimId: string, amount: number): boolean {
        // returns true if successful. Else, returns false

        // first check if both the recipient and the victim have wallets
        // load the wallets
        const wallets = require('./../../../data/wallets.json')

        if (wallets[recipientId] == undefined) return false
        if (wallets[victimId] == undefined) return false

        const recipientBal = wallets[recipientId]
        const victimBal = wallets[victimId]

        // check if there is enough money to steal
        if (victimBal < amount) return false;

        CommandClass.modifyBalance(recipientId, amount)
        CommandClass.modifyBalance(victimId, 0 - amount)

        
        return true;
        

    }

    // decorator factory
    /*
     * @param time time of cooldown in ms
     * @returns boolean
     */
    protected static memberCooldown(time: number) {
        
        // the decorator
        return function(target: any) {
            const oldCommandMain = target.prototype.commandMain
            target.mostRecentUse = [];

            const newCommandMain = (message: Message, client: Tau) => {
                const lastUseTime: number|undefined = target.mostRecentUse[message.author.id] // could be undefined

                if (lastUseTime == undefined) {
                    oldCommandMain(message, client)
                    target.mostRecentUse[message.author.id] = Date.now()
                    return;

                }
                const difference = Date.now() - lastUseTime

                if (difference >= time) {
                    target.mostRecentUse[message.author.id] = Date.now()
                    oldCommandMain(message, client)
                }
                else {
                    sendEmbed(message.channel, {
                        title: `That command is on cooldown, ${message.author.tag}.`,
                        color: errorColor,
                        deleteTimeout: 5000
                    })
                }
            }

            target.prototype.commandMain = newCommandMain
        } 
    }
}