DEFINE TABLE author SCHEMAFULL;
  DEFINE FIELD lastname 
    ON author TYPE string;
  DEFINE FIELD firstname 
    ON author TYPE string;

DEFINE TABLE authorRelation SCHEMAFULL;
  DEFINE FIELD in 
    ON authorRelation FLEXIBLE TYPE record(author);
  DEFINE FIELD out 
    ON authorRelation FLEXIBLE TYPE record(book);

BEGIN TRANSACTION;

  UPDATE author:test CONTENT {
    lastname: "lastname",
    firstname: "firstname",
  };

  RELATE author:test->authorRelation->book:test;


COMMIT TRANSACTION;