DEFINE TABLE book SCHEMAFULL;
  DEFINE FIELD title 
    ON book TYPE string;
  DEFINE FIELD chapters 
    ON book TYPE number;
  DEFINE FIELD tags 
    ON book TYPE array;
  DEFINE FIELD tags.* 
    ON book TYPE string;

BEGIN TRANSACTION;

  UPDATE book:test CONTENT {
    title: "something special",
    chapters: 1,
    tags: ["something", "special"],
  };

  -- CREATE book:["0001-0000-0001"] CONTENT { 
  --   title: "Book 1", 
  --   chapters: 3, 
  --   tags: ["fiction", "adventure"] 
  -- };

  -- CREATE book:["0001-0000-0002"] CONTENT { 
  --   title: "The Book of Stones", 
  --   chapters: 5, 
  --   tags: ["fantasy", "magic"] 
  -- };

  -- CREATE book:["0001-0000-0003"] CONTENT { 
  --   title: "How to Win Friends and Influence People", 
  --   chapters: 7, 
  --   tags: ["self-help", "motivation"] 
  -- };

  -- CREATE book:["0001-0000-0003"] CONTENT { 
  --   title: "1984", 
  --   chapters: 4, 
  --   tags: ["dystopia", "totalitarianism"] 
  -- };

  -- CREATE book:["0001-0000-0004"] CONTENT { 
  --   title: "Atlas shrugged", 
  --   chapters: 9, 
  --   tags: ["economics", "fiction"] 
  -- };

  -- CREATE book:["0001-0000-0005"] CONTENT { 
  --   title: "To Kill a Mockingbird", 
  --   chapters: 2, 
  --   tags: ["classic", "american-south"] 
  -- };

  -- CREATE book:["0001-0000-0006"] CONTENT { 
  --   title: "Jane Eyre", 
  --   chapters: 17, 
  --   tags: ["victorian", "romance"] 
  -- };

COMMIT TRANSACTION;