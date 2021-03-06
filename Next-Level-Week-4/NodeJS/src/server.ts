import { app } from "./app";

app.listen(3333, () => console.log("Server is running!"));

/**
 * GET => busca informação
 * POST => salvar informação
 * PUT => alterar alguma informação
 * DELETE => deletar
 * PATCH => Alteração específica
 */

//http://localhost:3333/users

// app.get("/users", (request, response) =>{
// app.get("/", (request, response) =>{
//     // return response.send("Hello Worls - NLW04");
//     return response.json({message: "Hello World - NLW04"});
// });

//1º param => Rota(Recurso API)
//2º param => request,response

// app.post("/", (request, response) => {
//     // recebeu os dados para salvar
//     return response.json({message: "Os dados foram salvos com sucesso!"});
// });

// app.listen(3333, () => console.log("Server is running!"));

