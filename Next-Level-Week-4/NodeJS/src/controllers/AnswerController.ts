import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SuveysUsersRepository";

class AnswerController{
    /**
     * Route Params => Parametros uqe compõem a rota 
     *      routtes.get("/answer/:value")
     * 
     * Query Params => Busca, Paginacao, não obrigatórios
     *  ?
     *  chave=valor 
     */
    async execute(request: Request, response: Response) {
        const { value } = request.params;
        const { u } = request.query;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u)
        });

        // if(!surveyUser) {
        //     return response.status(400).json({
        //         error: "Survey User does not exists!"
        //     })
        // }

        if(!surveyUser) {
            throw new AppError("Survey User does not exists!")
        }

        surveyUser.value = Number(value);

        await surveysUsersRepository.save(surveyUser);

        return response.json(surveyUser);
    }
}

export { AnswerController }