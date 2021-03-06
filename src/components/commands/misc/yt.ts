import { Message, MessageEmbed } from "discord.js";
import Tau from "../../..";
import CommandClass from "../../classes/CommandClass";
import ytVideo from "../../classes/ytVideo";
import textBlock from "../../utility/embeds/textBlock";
import getYTLinksFromQuery from "../../utility/getYTLinksFromQuery";

let youtubesearchapi = require('youtube-search-api');


@yt.errorCheck([
    yt.MISSING_ARGS_ERR_METACLASS(2)
])
export default class yt extends CommandClass {

    protected static commandCategory: string = 'misc'
    protected static commandDescription: string = 'Outputs search results for a youtube search'
    protected static commandSyntax: string = 'yt <query>'

    public async commandMain(message: Message, client: Tau): Promise<void> {
        const query = yt.removePrefixFromString(message.content, client.PREFIX)
        const links: ytVideo[] = await getYTLinksFromQuery(query)
        let embed = new MessageEmbed()
        .setTitle(textBlock(`Search results for ${query}`))
        .setColor('GREEN')
        for (let i = 0; i < links.length; i++) {
            embed.addField(textBlock(`Result ${i + 1}: ${links[i].title}`), links[i].URL, false)
        }
        message.channel.send(embed)
    }
    
}