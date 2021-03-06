import { Message, MessageEmbed, TextChannel, User } from "discord.js";
import Tau from "../../..";
import CommandClass from "../../classes/CommandClass";
import defaultColor from "../../utility/embeds/defaultColor";
import fetch from 'node-fetch'
import textBlock from "../../utility/embeds/textBlock";

const apiurl: string = 'https://opentdb.com/api.php?amount=1&type=multiple';
/*
{
    "response_code": 0,
    "results": [
        {
            "category": "Vehicles",
            "type": "multiple",
            "difficulty": "medium",
            "question": "Enzo Ferrari was originally an auto racer for what manufacturer before founding his own car company?",
            "correct_answer": "Alfa Romeo",
                "incorrect_answers": [
                "Auto Union",
                "Mercedes Benz",
                "Bentley"
            ]
        }
    ]
}
*/


const emojis: string[] = ['1️⃣', '2️⃣', '3️⃣', '4️⃣']




export default class question extends CommandClass {
    protected static commandCategory: string = 'trivia'
    protected static commandDescription: string = 'Asks a question'
    protected static commandSyntax: string = 'question'
    public async commandMain(message: Message, client: Tau): Promise<void> {
        const data = await getQuestion()
        const difficulty: string = data['difficulty']
        const question: string = data['question']
        const correctAnswer: string = data['correct_answer']
        const incorrectAnswers: string[] = data['incorrect_answers']
        const category: string = data['category']

        const channel: TextChannel = message.channel as TextChannel

        console.log(question)
        console.log(question)
        console.log(question)
        console.log(question)
        console.log(question)

        const embed: MessageEmbed = new MessageEmbed()
        .setColor(defaultColor)
        .setTitle(`Trivia`)
        .addField(`Category`, textBlock(category))
        .addField(`Difficulty`, textBlock(difficulty))
        .addField(`Question`, textBlock(question))
        .setTimestamp()
        

        let choices = [correctAnswer, incorrectAnswers[0], incorrectAnswers[1], incorrectAnswers[2]]

        // Shuffle the choices
        for (let i = choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choices[i], choices[j]] = [choices[j], choices[i]];
        }

        embed.addField('1', textBlock(choices[0]))
        embed.addField('2', textBlock(choices[1]))
        embed.addField('3', textBlock(choices[2]))
        embed.addField('4', textBlock(choices[3]))


        const sent = await channel.send({embeds: [embed]})
        await sent.react(emojis[0])
        await sent.react(emojis[1])
        await sent.react(emojis[2])
        await sent.react(emojis[3])

        
        
        let alreadyGuessedUsers: string[] = []
        // use message collector
        const filter = (reaction, user: User) => alreadyGuessedUsers.indexOf(user.id)
        const collector = sent.createReactionCollector({filter, time: 15000 })

        setTimeout(() => {
            //sent.react('5️⃣')
            sent.edit({embeds: [embed.setColor('RED')]})
        }, 10000)
        setTimeout(() => {
            sent.edit({embeds: [embed.setColor('YELLOW')]})
        }, 5000)
        setTimeout(() => {
            sent.edit({embeds: [embed.setColor('#282b30')]})
        }, 15000)


        

        collector.on('collect', (reaction, user) => {
            alreadyGuessedUsers.push(user.id) // blacklist the user from guessing again for this question
            //console.log(message.content)
            //alreadyGuessedUsers.push(message.author.id)
            //message.react('👌')
            console.log(reaction.emoji.toString())
        })

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`)

            const embed: MessageEmbed = new MessageEmbed()
            .setColor(defaultColor)
            .setTitle(`Correct answer: ${correctAnswer}`)


            let correctGuesses = 0
            let incorrectGuesses = 0
            collected.forEach(reaction => {
                reaction.users.cache.forEach(user => {
                    if (user.id == client.user.id) return // don't do it if the user is the bot
                    if(choices[emojis.indexOf(reaction.emoji.toString())] == correctAnswer) {
                        embed.addField(textBlock(`${user.username}${user.discriminator}: ${reaction.emoji.toString()}`), textBlock('Correct!'), true)
                        correctGuesses++
                    } else {
                        embed.addField(textBlock(`${user.username}${user.discriminator}: ${reaction.emoji.toString()}`), textBlock('Incorrect!'), true)
                        incorrectGuesses++
                    }
                })
                

                
            })
            embed.addField(`Correct guesses`, textBlock(String(correctGuesses)))
            embed.addField(`Incorrect guesses`, textBlock(String(incorrectGuesses)))

            channel.send({embeds: [embed]})
        });

    }
    
    
}
async function getQuestion(): Promise<object> {
    const result = await fetch(apiurl)
    const data = await result.json()
    console.log(data)
    return data['results'][0]
}