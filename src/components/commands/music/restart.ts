import { AudioPlayerStatus, createAudioResource, getVoiceConnection, PlayerSubscription } from "@discordjs/voice"
import { Message, TextChannel } from "discord.js"
import Tau from "../../../index"

import sendEmbed from "./../../utility/embeds/sendEmbed"
import ytdl from 'ytdl-core'
import checkQueueThenHandle from "./../../utility/checkQueueThenHandle"
import CommandClass from '../../classes/CommandClass.js'
import ConnectionWithPlayer from "../../classes/ConnectionWithPlayer.js"


@restart.alias(['r'])

@restart.errorCheck([
    restart.CLIENT_NOT_PLAYING_ANYTHING_ERR
])

export default class restart extends CommandClass { 
    protected static commandCategory: string = 'music'
    protected static commandDescription: string = 'the currently playing song restarts'
    protected static commandSyntax: string = 'restart'

    public async commandMain(message: Message, client: Tau) {
        console.log(client.queueMap[message.guild.id].playing.url)
        const audio = ytdl(client.queueMap[message.guild.id].playing.url)
        const connectionP: ConnectionWithPlayer = getVoiceConnection(message.guild.id) as ConnectionWithPlayer
        connectionP.player.stop()

        connectionP.player.play(createAudioResource(audio))
        /*connectionP.player.on(AudioPlayerStatus.Idle, () => {
            checkQueueThenHandle(message, message.guild.me.voice.connection)
        })
        */

        restart.sendEmbed(<TextChannel> message.channel, {
            title: `Restarting ${client.queueMap[message.guild.id].playing.songName}`,
            color: '#ffff00',
            deleteTimeout: 10000
        })
    }
}