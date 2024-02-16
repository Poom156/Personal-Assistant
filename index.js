import OpenAI from "openai";
import readlineSync from "readline-sync";
import dotenv from 'dotenv';
import color from "colors";
dotenv.config();

//API key from .env
//You'll need your own API key
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.error("API key not found in process.env");
    process.exit(1);
  }

const openai = new OpenAI({
  apiKey: apiKey,
});

async function main() {
    console.log(color.bold.green('Bot: Welcome to the chatbot program!'));

    //Storing chat history
    const chatHistory = [];

    while (true) {

        const userInput = readlineSync.question(color.yellow('You: '));

        try {
          // Construct messages by iterating over the history
          const messages = chatHistory.map(([role, content]) => ({role, content}));

          // Add latest user input
          messages.push({role: 'user', content: userInput});

            const completion = await openai.chat.completions.create({
                messages: messages,
                model: "gpt-3.5-turbo",
              });

            const completionText = color.bold.green(completion.choices[0].message.content)

            if (userInput.toLowerCase() === 'exit') {
              console.log(color.green.bold('Bot: ') + completionText);              
                return;
            } 

            console.log(color.green.bold('Bot: ') + completionText);

            chatHistory.push(['user', userInput]);
            chatHistory.push(['assistant', completionText]);

        } catch (error) {
            console.error(color.red(error));
        }
    }
}

main();