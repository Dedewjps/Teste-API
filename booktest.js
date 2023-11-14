describe("API Tests", () => {
  // Variável para armazenar o token de autenticação
  let authToken;

  // Teste para autenticar e obter o token
  it("Autenticar e obter token", () => {
    cy.request({
      method: "POST",
      url: "https://simple-books-api.glitch.me/api-clients",
      body: {
        clientName: "Postman",
        clientEmail: "valentin@example.com",
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("accessToken");
      authToken = response.body.accessToken;
    });
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
      expect(response.status).to.equal(200);
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
      expect(response.status).to.equal(200);
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
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array").and.not.to.be.empty;
    });
  });

  // Teste para atualizar um pedido usando PATCH
  it("Atualizar um pedido usando PATCH", () => {
    // Suponha que orderId seja um ID válido de um pedido existente
    const orderId = "PF6MflPDcuhWobZcgmJy5";

    const updatedOrderData = {
      customerName: "UpdatedJohn",
    };

    cy.request({
      method: "PATCH",
      url: `https://simple-books-api.glitch.me/orders/${orderId}`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: updatedOrderData,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("orderId");
      expect(response.body.customerName).to.equal(updatedOrderData.customerName);
    });
  });

  // Teste para deletar um pedido
  it("Deletar um pedido", () => {
    // Suponha que orderId seja um ID válido de um pedido existente
    const orderId = "PF6MflPDcuhWobZcgmJy5";

    cy.request({
      method: "DELETE",
      url: `https://simple-books-api.glitch.me/orders/${orderId}`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
    });
  });
});
