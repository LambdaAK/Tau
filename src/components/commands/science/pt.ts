import { ColorResolvable, Message, Embed, TextChannel, EmbedBuilder, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import Tau from '../../..';
import CommandClass from "../../classes/CommandClass.js";
import { MISSING_ARGS_ERR_METACLASS } from '../../classes/Errors.js';
import ErrorClass from '../../classes/ErrorSuperClass.js';

import periodicTable from 'periodic-table';

/*
@pt.errorCheck([
    pt.MISSING_ARGS_ERR_2,
    pt.ELEMENT_NOT_FOUND_ERR
])
*/

export default class pt extends CommandClass {
    /* 3 possibilities for input
        -a whole number between 1 and 118
        -a periodic symbol
        -an element name
    */

    // fix the error for when an integer is inputted
    protected static commandCategory: string = 'science'
    protected static commandDescription: string = 'You can look up any element on the periodic table'
    protected static commandSyntax: string = 'pt <name/symbol/atomic number>'
    static MISSING_ARGS_ERR_2 = MISSING_ARGS_ERR_METACLASS(2)


    static groupBlockColor = {
        'alkali metal': '6462a1',
        'alkaline earth metal': '6b7dc2',
        'transition metal': '6db4c2',
        'metalloid': '74cc90',
        'nonmetal': '9fd474',
        'halogen': 'dae37b',
        'noble gas': 'd6a772',
        'lanthanoid': 'db7676',
        'actinoid': 'db7676',
        'post-transition metal': 'f01111'

    }


    public static slashCommand = new SlashCommandBuilder()
        .setName('pt')
        .setDescription('Research any element on the periodic table')
        .addStringOption(query =>
            query.setName('query')
                .setDescription('Atomic number, atomic symbol, or element name')
                .setRequired(true)
        )




    public getInfo(search: string): object {
        console.log(search)
        const elementFromName = periodicTable.elements[search]
        const elementFromSymbol = periodicTable.symbols[search]
        const elementFromAtomicNumber = periodicTable.numbers[Number(search)]

        console.log(elementFromAtomicNumber)
        console.log(elementFromName)
        console.log(elementFromSymbol)

        if (elementFromName != undefined) return elementFromName
        else if (elementFromSymbol != undefined) return elementFromSymbol
        else if (elementFromAtomicNumber != undefined) return elementFromAtomicNumber
        else return undefined
    }

    static ELEMENT_NOT_FOUND_ERR = class ELEMENT_NOT_FOUND_ERR extends ErrorClass {
        checkPresence(message: Message): boolean {
            console.log(pt.prototype.getInfo(pt.splitArgs(message)[1]))
            if (!pt.prototype.getInfo(pt.splitArgs(message)[1])) return true
            else return false
        }

        standardHandle(message: Message): void {
            pt.sendErrMessage(<TextChannel> message.channel, `You must provide a valid element name, element symbol, or atomic number to use the pt command, ${message.author.tag}.`)
        }

    }

    public async commandMain(interaction: ChatInputCommandInteraction, client: Tau) {
        /*
        {
        atomicNumber: 10,
        symbol: 'Ne',
        name: 'Neon',
        atomicMass: '20.1797(6)',
        cpkHexColor: 'B3E3F5',
        electronicConfiguration: '[He] 2s2 2p6',
        electronegativity: '',
        atomicRadius: 69,
        ionRadius: '',
        vanDelWaalsRadius: 154,
        ionizationEnergy: 2081,
        electronAffinity: 0,
        oxidationStates: '',
        standardState: 'gas',
        bondingType: 'atomic',
        meltingPoint: 25,
        boilingPoint: 27,
        density: 0.0009,
        groupBlock: 'noble gas',
        yearDiscovered: 1898
        }
        */
        

        const table = new pt();


        const query = interaction.options.getString('query')


        const element = table.getInfo(query)
        console.log(element)
        
        const embed = new EmbedBuilder()
        const name = element['name']
        const info: object = {
            symbol : element['symbol'],
            atomicNumber : element['atomicNumber'],
            AtomicMass : element['atomicMass'],
            electronicConfiguration : element['electronicConfiguration'],
            atomicRadius : element['atomicRadius'],
            standardState : element['standardState'],
            groupBlock : element['groupBlock']
        }

        

        /*
        embed.addField('Symbol', element['symbol'], false)
        
        embed.addField('Atomic Number', String(element['atomicNumber']), false)
        
        embed.addField('Atomic Mass', String(element['atomicMass']), false)
        embed.addField('Electron Configuration', element['electronicConfiguration'], false)
        embed.addField('Atomic Radius', String(element['atomicRadius']), false)
        embed.addField('State', element['standardState'], false)
        embed.addField('Block', element['groupBlock'], false)
        */



        
        embed.setTitle(`Information for ${name}`)
        
        for (let [key, value] of Object.entries(info)) {
            if (value != '' && value != undefined && value != null) {
                embed.addFields({
                    name: key,
                    value: String(value),
                    inline: true
                })
            }
            console.log(key)
            console.log(value)
        }
        
        
        for (let [key, value] of Object.entries(pt.groupBlockColor)) {
            if (info['groupBlock'] == key) embed.setColor(<ColorResolvable> value)
        }
        
        embed.setTimestamp()

        interaction.reply({embeds: [embed]})  
        
    }
}