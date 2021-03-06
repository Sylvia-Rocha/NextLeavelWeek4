import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SuveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRespository";
import SendMailService from "../services/SendMailService";
import { resolve } from 'path';
import { AppError } from "../errors/AppError";

class SendMailController {
    
    async execute(request: Request, response: Response){
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({email});

        // if(!user){
        //     return response.status(400).json({
        //         error: "User does not exists",
        //     });
        // }

        if(!user){
            throw new AppError("User does not exists!");
        }

        const survey = await surveysRepository.findOne({id: survey_id});

        // if(!survey){
        //     return response.status(400).json({
        //         error: "Survey does not exists",
        //     })
        // }

        if(!survey){
            throw new AppError("Survey does not exists!");
        }
        
        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
                // where com OR
            // where: [{user_id: user.id}, {value: null}],
                //where com AND
            where: {user_id: user.id, value: null},
            relations: ["user", "survey"],
        });

        const variables = {
            name: user.name,
            title: survey.title,
            descriptions: survey.description,
            // user_id: user.id,
            id: "", 
            link: process.env.URL_MAIL,
        };

        if(surveyUserAlreadyExists){
            variables.id = surveyUserAlreadyExists.id;
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUserAlreadyExists);
        }

        // Salvar as informações na tabela surveyUser
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        });

        await surveysUsersRepository.save(surveyUser);
        
        // Enviar e-mail para o usuario
        variables.id = surveyUser.id;
        await SendMailService.execute(email, survey.title, variables, npsPath);

        return response.json(surveyUser);
    }
}

export { SendMailController }