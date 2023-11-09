describe("Teste simples API livros", () => {
    it("deve retornar lista de livros", () => {
      // Visita URL da API
      cy.visit("https://simple-books-api.glitch.me");
  
      // Realiza uma solicitação GET para buscar a lista de livros
      cy.request({
        method: "GET",
        url: "/books",
        qs: {
          type: "fiction", // Parâmetro de consulta opcional
          limit: 10,       // Parâmetro de consulta opcional
        },
      }).then((response) => {

        expect(response.status).to.equal(200);
  
        // Valida que o corpo da resposta é um array.
        expect(response.body).to.be.an("array");
  
        // Realiza asserções adicionais na resposta conforme necessário.
        // Por exemplo, você pode verificar a quantidade de livros retornados:
        expect(response.body).to.have.length.at.least(1);
  
        // Você também pode verificar a estrutura dos objetos de livro individuais
        // Por exemplo, se cada livro deve ter uma propriedade 'title':
        response.body.forEach((book) => {
          expect(book).to.have.property("title");
        });
      });
    });
  });
  