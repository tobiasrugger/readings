-- Practice links for every Grammar Check skill (student page + check done screen)
-- Safe to run more than once: skips any skill + url pair that already exists.
insert into skill_resources (skill, label, url, kind, max_band, sort_order)
select v.skill, v.label, v.url, v.kind, v.max_band, v.sort_order
from (values
 ('articles', 'A, An, The, or Nothing 1', 'https://tobiasrugger.github.io/readings/grammar/?u=articles-1', 'practice', 79, 10),
 ('plurals-possessives-pronouns', 'Plurals and Possessives 1', 'https://tobiasrugger.github.io/readings/grammar/?u=plurals-possessives-1', 'practice', 79, 10),
 ('prepositions', 'In, On, At: Places 1', 'https://tobiasrugger.github.io/readings/grammar/?u=in-on-at-place-1', 'practice', 79, 10),
 ('prepositions', 'In, On, and At: Time', 'https://tobiasrugger.github.io/readings/grammar/?u=in-on-at-time', 'practice', 79, 20),
 ('prepositions', 'For, To, and With 1', 'https://tobiasrugger.github.io/readings/grammar/?u=for-to-with-1', 'practice', 79, 30),
 ('negation-and-questions', 'Questions and Negatives 1', 'https://tobiasrugger.github.io/readings/grammar/?u=questions-negatives-1', 'practice', 79, 10),
 ('adjectives-and-adverbs', 'Adjective or Adverb? 1', 'https://tobiasrugger.github.io/readings/grammar/?u=adjectives-adverbs-1', 'practice', 79, 10),
 ('simple-tenses', 'Present and Past Tense Verbs', 'https://tobiasrugger.github.io/readings/verbs/', 'practice', 79, 10),
 ('simple-tenses', 'Subject and Verb Agreement 1', 'https://tobiasrugger.github.io/readings/grammar/?u=subject-verb-1', 'practice', 79, 20),
 ('perfect-tenses', 'Have / Has + Done 1', 'https://tobiasrugger.github.io/readings/grammar/?u=present-perfect-1', 'practice', 79, 10),
 ('progressive-tenses', 'Happening Now (-ing) 1', 'https://tobiasrugger.github.io/readings/grammar/?u=progressive-1', 'practice', 79, 10),
 ('modals-and-contractions', 'Can, Could, Should + Don''t, Won''t 1', 'https://tobiasrugger.github.io/readings/grammar/?u=modals-contractions-1', 'practice', 79, 10),
 ('pronouns-advanced', 'Me, Mine, Myself 1', 'https://tobiasrugger.github.io/readings/grammar/?u=pronouns-2', 'practice', 79, 10),
 ('articles-uncountable', 'Some Water, Two Bottles 1', 'https://tobiasrugger.github.io/readings/grammar/?u=uncountable-nouns-1', 'practice', 79, 10),
 ('articles-uncountable', 'A, An, The, or Nothing 1', 'https://tobiasrugger.github.io/readings/grammar/?u=articles-1', 'practice', 79, 20),
 ('gerunds-infinitives', 'To Go or Going? 1', 'https://tobiasrugger.github.io/readings/grammar/?u=gerunds-infinitives-1', 'practice', 79, 10),
 ('confused-words', 'Say or Tell? Make or Do? 1', 'https://tobiasrugger.github.io/readings/grammar/?u=confused-words-1', 'practice', 79, 10),
 ('question-forms', 'Tell Me Where It Is 1', 'https://tobiasrugger.github.io/readings/grammar/?u=question-forms-1', 'practice', 79, 10),
 ('compound-subjects', 'Joining Sentences 1', 'https://tobiasrugger.github.io/readings/grammar/?u=joining-sentences-1', 'practice', 79, 10),
 ('compound-objects', 'Lists with Commas 1', 'https://tobiasrugger.github.io/readings/grammar/?u=lists-commas-1', 'practice', 79, 10),
 ('compound-predicates', 'Joining Sentences 1', 'https://tobiasrugger.github.io/readings/grammar/?u=joining-sentences-1', 'practice', 79, 10),
 ('appositives', 'Who Is It? Adding Details with Commas 1', 'https://tobiasrugger.github.io/readings/grammar/?u=appositives-1', 'practice', 79, 10),
 ('compound-sentences', 'Joining Sentences 1', 'https://tobiasrugger.github.io/readings/grammar/?u=joining-sentences-1', 'practice', 79, 10),
 ('compound-sentences', 'And, But, So', 'https://tobiasrugger.github.io/readings/grammar/?u=and-but-so', 'practice', 79, 20),
 ('complex-sentences', 'Joining Sentences 2: Because, Although, If', 'https://tobiasrugger.github.io/readings/grammar/?u=joining-sentences-2', 'practice', 79, 10),
 ('compound-complex-basic', 'Joining Sentences 3: Two Joining Words', 'https://tobiasrugger.github.io/readings/grammar/?u=joining-sentences-3', 'practice', 79, 10),
 ('compound-complex-advanced', 'Joining Sentences 3: Two Joining Words', 'https://tobiasrugger.github.io/readings/grammar/?u=joining-sentences-3', 'practice', 79, 10),
 ('conjunctive-adverbs', 'However, Therefore, In Addition 1', 'https://tobiasrugger.github.io/readings/grammar/?u=however-therefore-1', 'practice', 79, 10),
 ('subject-verb-agreement', 'Subject and Verb Agreement 1', 'https://tobiasrugger.github.io/readings/grammar/?u=subject-verb-1', 'practice', 79, 10),
 ('conjunctions', 'And, But, So', 'https://tobiasrugger.github.io/readings/grammar/?u=and-but-so', 'practice', 79, 10),
 ('commas', 'Commas 1: Lists and Joining Sentences', 'https://tobiasrugger.github.io/readings/grammar/?u=commas-1', 'practice', 79, 10),
 ('comma-splices', 'Commas 1: Lists and Joining Sentences', 'https://tobiasrugger.github.io/readings/grammar/?u=commas-1', 'practice', 79, 10)
) as v(skill, label, url, kind, max_band, sort_order)
where not exists (
  select 1 from skill_resources r where r.skill = v.skill and r.url = v.url
);

select skill, count(*) from skill_resources group by skill order by skill;
