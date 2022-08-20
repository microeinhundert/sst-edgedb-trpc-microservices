CREATE MIGRATION m1l4yvjnhita7ikrqpd52ruclxz3kxhiqorquhlfct2zpdcbp3ehfq
    ONTO initial
{
  CREATE TYPE default::User {
      CREATE REQUIRED PROPERTY family_name -> std::str;
      CREATE REQUIRED PROPERTY given_name -> std::str;
  };
};