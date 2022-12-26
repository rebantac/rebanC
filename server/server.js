// all the calls and config to call the openAI

import express from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

// Dummy get()
app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from RebanC',
    })
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        // Refer to -> https://beta.openai.com/playground/p/default-openai-api?lang=node.js&model=text-davinci-003
        // for attributes
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error })
    }
});

app.listen(process.env.PORT || 5000);