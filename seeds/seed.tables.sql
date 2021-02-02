BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Chinese', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, '练习', 'exercise', 2),
  (2, 1, '你好', 'hello', 3),
  (3, 1, '房间', 'room', 4),
  (4, 1, '工程师', 'engineer', 5),
  (5, 1, '翻译', 'translate', 6),
  (6, 1, '不可置信', 'incredible', 7),
  (7, 1, '熊猫', 'panda', 8),
  (8, 1, '老鹰', 'eagle', null),
  (9, 1, '编程', 'coding', null),
  (10, 1, '电视', 'television', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
