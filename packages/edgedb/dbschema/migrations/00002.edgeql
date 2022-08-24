CREATE MIGRATION m134igsw5sl6ttocc6bglu3a445p3opb7bjjj6yjsfdddep6vlmacq
    ONTO m1l4yvjnhita7ikrqpd52ruclxz3kxhiqorquhlfct2zpdcbp3ehfq
{
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY email -> std::str {
          SET REQUIRED USING ('l.seipp@microeinhundert.com');
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
