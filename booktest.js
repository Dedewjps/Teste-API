describe("Testes da API", () => {
  // Variável para armazenar o token de autenticação
  let authToken;
  let orderIds = [];

  // Função para registrar um novo cliente e obter o token
  const registerAndAuthenticateClient = () => {
    const uniqueClientEmail = `unique-${Cypress._.random(1e6)}@example.com`;
    const uniqueClientName = `UniqueClient${Cypress._.random(1e6)}`;

    cy.request({
      method: "POST",
      url: "https://simple-books-api.glitch.me/api-clients",
      body: {
        clientName: uniqueClientName,
        clientEmail: uniqueClientEmail,
      },
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 409 && response.body.error.includes("API client already registered")) {
        // Cliente da API já existe, obtém o token existente
        cy.request({
          method: "POST",
          url: "https://simple-books-api.glitch.me/api-clients",
          body: {
            clientName: uniqueClientName,
            clientEmail: uniqueClientEmail,
          },
        }).then((existingClientResponse) => {
          expect(response.status).to.be.oneOf([200, 201]);
          expect(existingClientResponse.body).to.have.property("accessToken");
          authToken = existingClientResponse.body.accessToken;
        });
      } else {
        // Cliente da API criado com sucesso ou encontrou um erro diferente
        expect(response.status).to.be.oneOf([200, 201])
        expect(response.body).to.have.property("accessToken");
        authToken = response.body.accessToken;
      }
    });
  };

  // Teste para autenticar e obter o token
  it("Autenticar e obter token", () => {
    registerAndAuthenticateClient();
  });

  // Teste para retornar livros do tipo ficção
  it("Retornar livros do tipo ficção", () => {
    cy.request({
      method: "GET",
      url: "https://simple-books-api.glitch.me/books",
      qs: {
        type: "fiction",
        limit: 5,
      },
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201])
      expect(response.body).to.be.an("array").and.not.to.be.empty;
    });
  });

  // Teste para realizar um pedido usando POST
  it("Realizar um pedido usando POST", () => {
    const orderData = {
      bookId: 1,
      customerName: "John",
    };

    cy.request({
      method: "POST",
      url: "https://simple-books-api.glitch.me/orders",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: orderData,
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201]); // Permite 200 ou 201
      expect(response.body).to.have.property("orderId");
    });
  });

  // Teste para retornar todos os pedidos
  it("Retornar todos os pedidos", () => {
    cy.request({
      method: "GET",
      url: "https://simple-books-api.glitch.me/orders",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201])
      expect(response.body).to.be.an("array").and.not.to.be.empty;
    });
  });

  // Teste para atualizar um pedido usando PATCH
  it("Atualizar um pedido usando PATCH", () => {
    if (orderIds.length === 0) {
      throw new Error("Nenhum ID de pedido válido encontrado.");
    }

    // Escolhe aleatoriamente um ID de pedido do array
    const randomOrderId = Cypress._.sample(orderIds);

    cy.request({
      method: "PATCH",
      url: `https://simple-books-api.glitch.me/orders/${randomOrderId}`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: updatedOrderData,
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201])
      expect(response.body).to.have.property("orderId");
      expect(response.body.customerName).to.equal(updatedOrderData.customerName);
    });
  });

  // Teste para deletar um pedido
  it("Deletar um pedido", () => {
    // Suponha que orderId seja um ID válido de um pedido existente
    if (orderIds.length === 0) {
      throw new Error("Nenhum ID de pedido válido encontrado.");
    }

    // Escolhe aleatoriamente um ID de pedido do array
    const randomOrderId = Cypress._.sample(orderIds);

    cy.request({
      method: "DELETE",
      url: `https://simple-books-api.glitch.me/orders/${randomOrderId}`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201])
    });
  });
});
