/* =====================================================================
   tests.js  -  Grammar Checks item bank (Mr. Toby, Galileo)
   Six tests. Original items, modeled on the skill structure of the
   Quill ELL Starter / ELL Intermediate / ELL Advanced / Intermediate
   diagnostics. Checks A and B use NEW items, so they can be a second
   form later.

   SLOT SYNTAX (type "slots")
     {ans}          blank; student picks from item.opts
     {a/b}          either answer is correct
     {}             correct answer is NO word (needs empty:true)
     {the/}         "the" or no word
     [orig>ans:c1,c2,c3]   underlined word; starts as orig; tap to change
     [orig:c1,c2]          underlined word that is already correct
   distinct:true  -> every blank must be a different correct answer
   ===================================================================== */

var SKILLS = {
  /* ELL Starter */
  "articles":                    "Articles (a, an, the)",
  "plurals-possessives-pronouns":"Plurals, possessives, pronouns",
  "prepositions":                "Prepositions",
  "negation-and-questions":      "Negatives and questions",
  "adjectives-and-adverbs":      "Adjectives and adverbs",
  /* ELL Intermediate */
  "simple-tenses":               "Simple tenses",
  "perfect-tenses":              "Perfect tenses",
  "progressive-tenses":          "Progressive tenses",
  "modals-and-contractions":     "Modals and contractions",
  /* ELL Advanced */
  "pronouns-advanced":           "Pronouns (advanced)",
  "articles-uncountable":        "Articles and uncountable nouns",
  "gerunds-infinitives":         "Gerunds and infinitives",
  "confused-words":              "Commonly confused words",
  "question-forms":              "Question forms",
  /* Intermediate (sentence combining) */
  "compound-subjects":           "Compound subjects",
  "compound-objects":            "Compound objects",
  "compound-predicates":         "Compound predicates",
  "appositives":                 "Appositive phrases",
  "compound-sentences":          "Compound sentences",
  "complex-sentences":           "Complex sentences",
  "compound-complex-basic":      "Compound-complex (basic)",
  "compound-complex-advanced":   "Compound-complex (advanced)",
  "conjunctive-adverbs":         "Conjunctive adverbs"
};

/* conjunctive adverb answers: "A; however, b." and "A. However, b." */
function CONJ(a, word, b) {
  var W = word.charAt(0).toUpperCase() + word.slice(1);
  var B = b.charAt(0).toUpperCase() + b.slice(1);
  return [a + "; " + word + ", " + b + ".", a + ". " + W + ", " + b + "."];
}
/* a list of three, with and without the last comma */
function LIST3(pre, x, y, z, post) {
  post = post || ".";
  return [pre + x + ", " + y + ", and " + z + post, pre + x + ", " + y + " and " + z + post];
}

var D_FILL  = "Fill in each blank with one of the words.";
var D_EMPTY = "Fill in the blanks. Some blanks need NO word. Choose \u2205 for those.";
var D_FIX   = "Read the sentence. Tap the underlined words that are wrong and fix them. Do not change words that are already correct.";
var D_ONE   = "Choose the best answer for the blank.";
var D_TWO   = "There are two correct answers. Use a different correct answer in each blank.";
var D_AND   = "Combine the sentences into one sentence. Use the joining word.";
var D_BEST  = "Combine the sentences into one sentence. Use the joining word that shows how the ideas connect.";
var D_BOTH  = "Combine the sentences into one sentence. Use both joining words.";
var D_APPO  = "Combine the sentences into one sentence. Do not add any new words. You may take out words you do not need.";
var D_ADV   = "Use one of the joining words to connect the sentences. You can write one sentence or two.";

var TESTS = [

/* =================================================================
   1. ELL STARTER  (13 items, 5 skills)
   ================================================================= */
{ id:"ell-starter", title:"Grammar Check: Starter", short:"Starter",
  sub:"Articles, plurals, prepositions, questions, adjectives", mirrors:"Quill ELL Starter",
  items:[
  { id:"st01", skill:"articles", type:"slots", empty:true, dir:D_EMPTY, opts:["a","an","the"],
    text:"Nadia has {an} old bike. She rides it to {} school every day. {the} bike is {} blue. She wants {a} new helmet." },
  { id:"st02", skill:"articles", type:"slots", empty:true, dir:D_EMPTY, opts:["a","an","the"],
    text:"I eat {an} apple every morning. {the} apple is always {} red. I also like {} bananas, but my sister likes {} oranges." },
  { id:"st03", skill:"plurals-possessives-pronouns", type:"slots", distinct:true, dir:D_TWO,
    opts:["Tomas's bag","his bag","his","the bag of Tomas","Tomas bag","him bag","he bag","the bag of him"],
    text:"This bag belongs to Tomas. It is {Tomas's bag/his bag/his}. This bag belongs to Tomas. It is {Tomas's bag/his bag/his}." },
  { id:"st04", skill:"plurals-possessives-pronouns", type:"slots", dir:"Change the underlined words so they talk about more than one person or thing.",
    text:"There are many [man>men:man,mans,men,mens] at the bus stop. Two [child>children:child,childs,children,childrens] are sitting on the bench." },
  { id:"st05", skill:"plurals-possessives-pronouns", type:"slots", dir:"Change the underlined words so they talk about more than one person or thing.",
    text:"The two [woman>women:woman,womans,women,womens] carry five [box>boxes:box,boxs,boxes,boxies]. Their [baby>babies:baby,babys,babies,babyes] are sleeping." },
  { id:"st06", skill:"prepositions", type:"slots", dir:"Fill in each blank with one of the words. You can use a word more than once.",
    opts:["in","on","at","to","for","with"],
    text:"My family goes {to} the park {on} Saturdays. We go {at} ten o'clock {in} the morning. I play soccer {with} my cousins {for} two hours." },
  { id:"st07", skill:"prepositions", type:"slots", dir:"Fill in each blank with one of the words. You can use a word more than once.",
    opts:["in","on","at","to","from","of","for"],
    text:"I was born {in} Guatemala {in} 2010. Now I live {in} San Francisco. My apartment is {on} Clement Street. I go {to} school {at} eight o'clock. My best friend is {from} Mexico." },
  { id:"st08", skill:"negation-and-questions", type:"slots", dir:D_FILL, opts:["what","where","when","who","why","how"],
    text:"{where} is the library? {what} time does it open? {who} is the librarian? {why} is the door closed? {how} old is the library?" },
  { id:"st09", skill:"negation-and-questions", type:"slots", dir:"Fix the underlined words so the questions are correct.",
    text:"[She is>Is she:She is,Is she,Does she,Is she is] a student? [Has she>Does she have:Has she,Does she have,Does she has,She has] a brother?" },
  { id:"st10", skill:"negation-and-questions", type:"slots", dir:"Fix the underlined words. Keep the word \"not\" in each sentence.",
    text:"My brother [not is>is not:not is,is not,no is,not be] a teacher. He [not works>does not work:not works,does not work,do not work,does not works] at a school." },
  { id:"st11", skill:"adjectives-and-adverbs", type:"slots", dir:"Fill in each blank. You can use a word more than once.", opts:["slow","slowly"],
    text:"My grandpa walks {slowly}. He is a {slow} walker. Please drive {slowly} near the school. The bus is very {slow} today." },
  { id:"st12", skill:"adjectives-and-adverbs", type:"slots", dir:"Fill in each blank. You can use a word more than once.", opts:["tall","taller","tallest"],
    text:"Ana is {tall}. Her brother is {taller} than Ana. Their father is the {tallest} person in the family." },
  { id:"st13", skill:"adjectives-and-adverbs", type:"order", dir:"Put the words in the correct order.",
    tiles:["sings","beautifully","my","sister","little"], post:".",
    accept:["My little sister sings beautifully."] }
  ]},

/* =================================================================
   2. ELL INTERMEDIATE  (22 items, 4 skills)
   ================================================================= */
{ id:"ell-intermediate", title:"Grammar Check: Verb Tenses", short:"Verb tenses",
  sub:"Simple, perfect, and progressive tenses; modals", mirrors:"Quill ELL Intermediate",
  items:[
  { id:"in01", skill:"simple-tenses", type:"slots", dir:"Change the underlined word to fit the sentence.",
    text:"Maria [call>called:call,calls,called,calling] her grandmother last night." },
  { id:"in02", skill:"simple-tenses", type:"slots", dir:"Change the underlined word to fit the sentence.",
    text:"We [stop>stopped:stop,stoped,stopped,stopping] at the store yesterday." },
  { id:"in03", skill:"simple-tenses", type:"slots", dir:"Change the underlined word to fit the sentence.",
    text:"She [study>studied:study,studyed,studied,studies] for the test last week." },
  { id:"in04", skill:"simple-tenses", type:"slots", dir:"Change the underlined word to fit the sentence.",
    text:"My brother [have>has:have,haves,has,having] a new phone now." },
  { id:"in05", skill:"simple-tenses", type:"slots", dir:D_ONE, opts:["buys","bought","will buy","has bought","is buying","had bought"],
    text:"My dad {bought} a new car two weeks ago." },
  { id:"in06", skill:"simple-tenses", type:"slots", dir:D_ONE, opts:["goes","went","will go","was going","has gone","had gone"],
    text:"I promise that I {will go} to your party next Saturday." },
  { id:"in07", skill:"simple-tenses", type:"slots", dir:"Fill in each blank.", opts:["finish","finished","will finish","call","called","will call"],
    text:"When I {finish} my homework tonight, I {will call} you." },
  { id:"in08", skill:"perfect-tenses", type:"slots", dir:"Change the underlined word to fit the sentence.",
    text:"They have [write>written:write,wrote,written,writed] three stories this year." },
  { id:"in09", skill:"perfect-tenses", type:"slots", dir:"Change the underlined word to fit the sentence.",
    text:"Have you ever [see>seen:see,saw,seen,seed] snow?" },
  { id:"in10", skill:"perfect-tenses", type:"slots", dir:"Change the underlined word to fit the sentence.",
    text:"He has [take>taken:take,took,taken,taked] the bus to school all year." },
  { id:"in11", skill:"perfect-tenses", type:"slots", dir:D_ONE, opts:["lives","lived","has lived","had lived","will live","is living"],
    text:"My family {has lived} in San Francisco since 2023." },
  { id:"in12", skill:"perfect-tenses", type:"slots", dir:D_ONE, opts:["leaves","left","has left","had left","will leave","was leaving"],
    text:"When we got to the station, the train {had left} already." },
  { id:"in13", skill:"perfect-tenses", type:"slots", dir:D_ONE, opts:["reads","read","has read","had read","will have read","is reading"],
    text:"By the end of this year, I {will have read} ten books in English." },
  { id:"in14", skill:"progressive-tenses", type:"slots", dir:"Change the underlined word to fit the sentence. The answer can be one or two words.",
    text:"Look! The baby [sleep>is sleeping:sleep,sleeps,is sleeping,sleeping] right now." },
  { id:"in15", skill:"progressive-tenses", type:"slots", dir:D_ONE, opts:["talk","talked","am talking","was talking","will talk","have talked"],
    text:"Shh! I {am talking} on the phone right now." },
  { id:"in16", skill:"progressive-tenses", type:"slots", dir:D_ONE, opts:["work","worked","will be working","was working","have worked","had worked"],
    text:"Don't call me tomorrow at 3:00. I {will be working} at the restaurant then." },
  { id:"in17", skill:"progressive-tenses", type:"slots", dir:D_ONE, opts:["read","reads","will read","was reading","am reading","have read"],
    text:"I {was reading} a book when the lights went out." },
  { id:"in18", skill:"progressive-tenses", type:"slots", dir:"Choose the answer that sounds most natural.",
    opts:["having a car","knowing her name","eating lunch","liking pizza","needing help"],
    text:"Are you {eating lunch}?" },
  { id:"in19", skill:"modals-and-contractions", type:"slots", dir:"Change each underlined part into one word with an apostrophe ( ' ).",
    text:"I [can not>can't:can not,can't,cann't,ca'nt] swim, and my sister [does not>doesn't:does not,doesn't,does'nt,dosen't] swim either." },
  { id:"in20", skill:"modals-and-contractions", type:"slots", dir:D_ONE, opts:["would go","would went","would have gone","would has gone","would to go","would gone"],
    text:"She {would have gone} to the beach yesterday, but it was raining." },
  { id:"in21", skill:"modals-and-contractions", type:"slots", dir:D_ONE, opts:["can't","couldn't","shouldn't","won't","mustn't","may not"],
    text:"I {couldn't} open the door last night because I lost my key." },
  { id:"in22", skill:"modals-and-contractions", type:"slots", dir:D_ONE, opts:["can","could","will","would","should","may"],
    text:"{would} you like some water?" }
  ]},

/* =================================================================
   3. ELL ADVANCED  (19 items, 5 skills)
   ================================================================= */
{ id:"ell-advanced", title:"Grammar Check: Advanced", short:"Advanced",
  sub:"Pronouns, uncountable nouns, gerunds, confusing words, questions", mirrors:"Quill ELL Advanced",
  items:[
  { id:"ad01", skill:"pronouns-advanced", type:"slots", dir:"Fill in each blank. You can use a word more than once.", opts:["I","me","my","mine","myself"],
    text:"This is {my} pencil. That pencil is {mine} too. Can you give {me} the red one? I will sharpen it {myself}." },
  { id:"ad02", skill:"pronouns-advanced", type:"slots", dir:"Fill in each blank. You can use a word more than once.", opts:["they","them","their","theirs","themselves"],
    text:"{they} built {their} house by {themselves}. The blue house next to ours is {theirs}. We visit {them} every Sunday." },
  { id:"ad03", skill:"pronouns-advanced", type:"slots", dir:"Choose the most natural words for the blank.",
    opts:["There is a fly","It is a fly","Is a fly","Has a fly","There are a fly","Have a fly"],
    text:"{There is a fly} in my soup! Please take it away." },
  { id:"ad04", skill:"pronouns-advanced", type:"slots", empty:true, dir:"Fill in the blanks. Some blanks need NO word. Choose \u2205 for those. You can use a word more than once.",
    opts:["he","him","his","himself"],
    text:"Every morning, {he} {} gets up at six. {he} washes {his} face and makes breakfast for {himself}. Then {he} goes {} to work. The black backpack on the chair is {his}." },
  { id:"ad05", skill:"articles-uncountable", type:"slots", empty:true, dir:D_EMPTY, opts:["a","an","the"],
    text:"I love {} music, especially {} jazz. Last year, I saw {a} concert in {} Golden Gate Park. {the} concert was free! I also play {the/} guitar." },
  { id:"ad06", skill:"articles-uncountable", type:"slots", dir:D_FIX,
    text:"My teacher gave me some [advices>advice:advices,advice,advice's,an advice] and a lot of [homeworks>homework:homeworks,homework,homeworkes,a homework] about the [stories:story,stories,storys,storyes]." },
  { id:"ad07", skill:"articles-uncountable", type:"slots", dir:D_FIX,
    text:"We need some [moneys>money:moneys,money,a money,monies] to buy [breads>bread:breads,bread,a bread,breades], [rices>rice:rices,rice,a rice,ricees], and three [bottles:bottle,bottles,bottle's,bottels] of water." },
  { id:"ad08", skill:"gerunds-infinitives", type:"slots", dir:"Fill in each blank. You can use a word more than once.", opts:["to clean","cleaning","clean","cleaned"],
    text:"My dad asked me {to clean} my room. I hate {cleaning/to clean}, but I finished {cleaning} it before dinner. Now I can {clean} the kitchen too." },
  { id:"ad09", skill:"gerunds-infinitives", type:"slots", dir:"Fill in each blank. You can use a word more than once.",
    opts:["bored","boring","to bore","watched","watching","to watch"],
    text:"{watching/to watch} that movie was so {boring}. Everyone was {bored} after an hour. Next time, I want {to watch} a comedy." },
  { id:"ad10", skill:"gerunds-infinitives", type:"slots", dir:"Fill in each blank. You can use a word more than once.", opts:["to go","going","go","went"],
    text:"Let's {go} to the beach! I enjoy {going} to the beach, and my friends want {to go} too. We {went} last summer." },
  { id:"ad11", skill:"confused-words", type:"slots", dir:"Fill in each blank. You can use a word more than once.", opts:["say","tell","talk","speak"],
    text:"Can you {tell} me the answer? What did the teacher {say}? I need to {talk/speak} to her after class. My mom can {speak} three languages." },
  { id:"ad12", skill:"confused-words", type:"slots", dir:"Fill in each blank. You can use a word more than once.", opts:["many","much","more","most"],
    text:"How {many} students are in your class? How {much} time do you have? This class has {more} students than my old class. Math is the {most} difficult subject for me." },
  { id:"ad13", skill:"confused-words", type:"slots", dir:"Fill in each blank. You can use a word more than once.", opts:["already","yet","still","again"],
    text:"Have you finished your essay {yet/already}? I {already} finished mine. My brother {still} hasn't started his. He has to write it {again} because he lost it." },
  { id:"ad14", skill:"confused-words", type:"slots", dir:"Fill in each blank. You can use a word more than once.",
    opts:["anything","nothing","anybody","nobody","ever","never"],
    text:"Have you {ever} eaten a mango? I have {never} tried one. I didn't eat {anything} this morning. {nobody} in my family likes mangoes." },
  { id:"ad15", skill:"question-forms", type:"order", dir:"Put the words in the correct order.",
    pre:"Can you tell me", tiles:["is","bathroom","the","where"], post:"?",
    accept:["Can you tell me where the bathroom is?"] },
  { id:"ad16", skill:"question-forms", type:"order", dir:"Put the words in the correct order.",
    pre:"Do you know", tiles:["leaves","what","bus","the","time"], post:"?",
    accept:["Do you know what time the bus leaves?"] },
  { id:"ad17", skill:"question-forms", type:"slots", distinct:true, dir:D_TWO,
    opts:["aren't you","right","isn't it","don't you","yes","no","doesn't you"],
    text:"You are new here, {aren't you/right}? You are new here, {aren't you/right}?" },
  { id:"ad18", skill:"question-forms", type:"slots", distinct:true, dir:D_TWO,
    opts:["Yes, she does","Yes, she likes","Yes, she likes it","Yes, likes","Yes, she is","Yes, she do"],
    text:"Question: Does your sister like pizza? Answer: {Yes, she does/Yes, she likes it}. Answer: {Yes, she does/Yes, she likes it}." },
  { id:"ad19", skill:"question-forms", type:"slots", dir:"Fill in each blank.", opts:["I am","I'm","I do","isn't he","is he","doesn't he","he isn't"],
    text:"Question: Are you hungry? Answer: Yes, {I am}. Your brother is hungry too, {isn't he}?" }
  ]},

/* =================================================================
   4. INTERMEDIATE (sentence combining)  (23 items, 9 skills)
   ================================================================= */
{ id:"intermediate", title:"Grammar Check: Combining Sentences", short:"Combining sentences",
  sub:"Joining words, commas, and longer sentences", mirrors:"Quill Intermediate",
  items:[
  { id:"cs01", skill:"compound-subjects", type:"write", dir:D_AND, words:["and"],
    prompt:"The bus was late. The train was late.",
    accept:["The bus and the train were late.","The bus and train were late.","The train and the bus were late.","The train and bus were late."] },
  { id:"cs02", skill:"compound-subjects", type:"write", dir:D_AND, words:["and"],
    prompt:"Luis likes to draw. Sara likes to draw.",
    accept:["Luis and Sara like to draw.","Sara and Luis like to draw."] },
  { id:"cs03", skill:"compound-objects", type:"write", dir:D_AND, words:["and"],
    prompt:"Octopuses eat crabs. Octopuses eat clams. Octopuses eat shrimp.",
    accept:LIST3("Octopuses eat ","crabs","clams","shrimp") },
  { id:"cs04", skill:"compound-objects", type:"write", dir:D_AND, words:["and"],
    prompt:"Our class visited the museum. Our class visited the library. Our class visited the park.",
    accept:LIST3("Our class visited ","the museum","the library","the park").concat(LIST3("Our class visited ","the museum","library","park")) },
  { id:"cs05", skill:"compound-predicates", type:"write", dir:D_AND, words:["and"],
    prompt:"Dolphins swim in groups. Dolphins hunt for fish together.",
    accept:["Dolphins swim in groups and hunt for fish together."] },
  { id:"cs06", skill:"compound-predicates", type:"write", dir:D_AND, words:["and"],
    prompt:"My mom works at a hospital. My mom takes classes at night.",
    accept:["My mom works at a hospital and takes classes at night."] },
  { id:"cs07", skill:"compound-predicates", type:"write", dir:D_AND, words:["and"],
    prompt:"Volcanoes can destroy towns when they erupt. Volcanoes can create new land when they erupt.",
    accept:["Volcanoes can destroy towns and create new land when they erupt.",
            "Volcanoes can destroy towns and can create new land when they erupt.",
            "When they erupt, volcanoes can destroy towns and create new land."] },
  { id:"cs08", skill:"compound-predicates", type:"write", dir:D_AND, words:["and"],
    prompt:"Most children can walk by fifteen months old. Most children can say a few words by fifteen months old.",
    accept:["Most children can walk and say a few words by fifteen months old.",
            "Most children can walk and can say a few words by fifteen months old.",
            "By fifteen months old, most children can walk and say a few words."] },
  { id:"cs09", skill:"appositives", type:"write", dir:D_APPO,
    prompt:"A seahorse is a kind of fish. A seahorse swims very slowly.",
    accept:["A seahorse, a kind of fish, swims very slowly."] },
  { id:"cs10", skill:"appositives", type:"write", dir:D_APPO,
    prompt:"We walked across the Golden Gate Bridge. The Golden Gate Bridge is a famous bridge in San Francisco.",
    accept:["We walked across the Golden Gate Bridge, a famous bridge in San Francisco."] },
  { id:"cs11", skill:"compound-sentences", type:"write", dir:D_AND, words:["and"],
    prompt:"My brother cooked dinner. My sister washed the dishes.",
    accept:["My brother cooked dinner, and my sister washed the dishes."] },
  { id:"cs12", skill:"compound-sentences", type:"write", dir:D_BEST, words:["and","or","but","so"],
    prompt:"Penguins are birds. Penguins cannot fly.",
    accept:["Penguins are birds, but penguins cannot fly.","Penguins are birds, but they cannot fly."] },
  { id:"cs13", skill:"compound-sentences", type:"write", dir:D_BEST, words:["and","or","but","so"],
    prompt:"It started to rain. We went inside.",
    accept:["It started to rain, so we went inside."] },
  { id:"cs14", skill:"complex-sentences", type:"write", dir:D_BEST, words:["although","because","unless"],
    prompt:"Cactuses can live in the desert. They store water in their stems.",
    accept:["Cactuses can live in the desert because they store water in their stems.",
            "Because they store water in their stems, cactuses can live in the desert."] },
  { id:"cs15", skill:"complex-sentences", type:"write", dir:D_BEST, words:["as soon as","since","even though"],
    prompt:"Owls look scary. They are not dangerous to people.",
    accept:["Even though owls look scary, they are not dangerous to people.",
            "Owls look scary even though they are not dangerous to people.",
            "Owls are not dangerous to people even though they look scary."] },
  { id:"cs16", skill:"complex-sentences", type:"write", dir:D_BEST, words:["unless","because","if","as soon as"],
    prompt:"You will not pass the driving test. You practice every week.",
    accept:["You will not pass the driving test unless you practice every week.",
            "Unless you practice every week, you will not pass the driving test."] },
  { id:"cs17", skill:"compound-complex-basic", type:"write", dir:D_BOTH, words:["but","because"],
    prompt:"Cats can stay inside all day. Dogs need to go outside every day. Dogs need exercise.",
    accept:["Cats can stay inside all day, but dogs need to go outside every day because they need exercise.",
            "Cats can stay inside all day, but dogs need to go outside every day because dogs need exercise."] },
  { id:"cs18", skill:"compound-complex-basic", type:"write", dir:D_BOTH, words:["so","where"],
    prompt:"Our school has a big garden. Students often eat lunch there. The flowers smell nice.",
    accept:["Our school has a big garden, so students often eat lunch there, where the flowers smell nice."] },
  { id:"cs19", skill:"compound-complex-advanced", type:"write", dir:D_BOTH, words:["although","so"],
    prompt:"Frogs can live on land. They breathe through their skin. Their skin must stay wet.",
    accept:["Although frogs can live on land, they breathe through their skin, so their skin must stay wet."] },
  { id:"cs20", skill:"compound-complex-advanced", type:"write", dir:D_BOTH, words:["after","but"],
    prompt:"The bell rang. Most students left the room. Kenji stayed to finish his test.",
    accept:["After the bell rang, most students left the room, but Kenji stayed to finish his test.",
            "Most students left the room after the bell rang, but Kenji stayed to finish his test."] },
  { id:"cs21", skill:"conjunctive-adverbs", type:"write", dir:D_ADV, words:["however","therefore","in addition","similarly"],
    prompt:"The bakery was closed. We bought bread at the grocery store.",
    accept:CONJ("The bakery was closed","therefore","we bought bread at the grocery store") },
  { id:"cs22", skill:"conjunctive-adverbs", type:"write", dir:D_ADV, words:["however","therefore","furthermore","as a result"],
    prompt:"The team practiced every day. They lost the final game.",
    accept:CONJ("The team practiced every day","however","they lost the final game") },
  { id:"cs23", skill:"conjunctive-adverbs", type:"write", dir:D_ADV, words:["however","in addition","as a result","therefore"],
    prompt:"Tomatoes need a lot of sun. They need water every day.",
    accept:CONJ("Tomatoes need a lot of sun","in addition","they need water every day") }
  ]},

/* =================================================================
   5. CHECK A  = Starter + Verb tenses  (20 NEW items, 9 skills)
   ================================================================= */
{ id:"check-a", title:"Grammar Check A", short:"Check A",
  sub:"Starter + verb tenses in one test. New questions.", mirrors:"ELL Starter + ELL Intermediate",
  items:[
  { id:"ca01", skill:"articles", type:"slots", empty:true, dir:D_EMPTY, opts:["a","an","the"],
    text:"My uncle drives {a} taxi. {the} taxi is {} yellow. He works {} every day, even on {} Sundays." },
  { id:"ca02", skill:"articles", type:"slots", empty:true, dir:D_EMPTY, opts:["a","an","the"],
    text:"Wei ate {an} egg and {a} banana for breakfast. {the} banana was {} delicious. After that, he went to {} school." },
  { id:"ca03", skill:"plurals-possessives-pronouns", type:"slots", distinct:true, dir:D_TWO,
    opts:["Aisha's phone","her phone","hers","the phone of Aisha","she phone","Aisha phone","hers phone"],
    text:"This phone belongs to Aisha. It is {Aisha's phone/her phone/hers}. This phone belongs to Aisha. It is {Aisha's phone/her phone/hers}." },
  { id:"ca04", skill:"plurals-possessives-pronouns", type:"slots", dir:"Change the underlined words so they talk about more than one person or thing.",
    text:"I brush my [tooth>teeth:tooth,tooths,teeth,teeths] two times a day. Many [person>people:person,peoples,people,persones] forget to do this." },
  { id:"ca05", skill:"prepositions", type:"slots", dir:"Fill in each blank with one of the words. You can use a word more than once.",
    opts:["in","on","at","to","for","with"],
    text:"The party is {on} Friday {at} seven o'clock. It is {at} Jenny's house. She lives {with} her aunt {in} the Sunset. I made a card {for} her." },
  { id:"ca06", skill:"prepositions", type:"slots", dir:"Fill in each blank with one of the words. You can use a word more than once.",
    opts:["in","on","at","to","from","of","by"],
    text:"I walk {to} school, but my friend comes {by} bus. Our first class starts {at} 8:40. We have a test {on} Monday. The test is {in} Room 212. Most students in my class are {from} China." },
  { id:"ca07", skill:"negation-and-questions", type:"slots", dir:D_FILL, opts:["who","what","where","when","why","how many"],
    text:"{where} do you live? {how many} brothers do you have? {what} is your favorite food? {when} is your birthday? {who} is your best friend?" },
  { id:"ca08", skill:"negation-and-questions", type:"slots", dir:"Fix the underlined words so the sentences are correct.",
    text:"She [no likes>does not like:no likes,does not like,does not likes,not like] coffee. [You like>Do you like:You like,Do you like,Does you like,Like you] coffee?" },
  { id:"ca09", skill:"adjectives-and-adverbs", type:"slots", dir:"Fill in each blank. You can use a word more than once.", opts:["careful","carefully"],
    text:"Be {careful}! The floor is wet. Please walk {carefully}. My sister is a {careful} driver. She always drives {carefully}." },
  { id:"ca10", skill:"adjectives-and-adverbs", type:"order", dir:"Put the words in the correct order.",
    tiles:["quietly","man","talks","old","the"], post:".",
    accept:["The old man talks quietly."] },
  { id:"ca11", skill:"simple-tenses", type:"slots", dir:"Change the underlined word to fit the sentence.",
    text:"My friends [play>played:play,plays,played,playing] soccer last Sunday." },
  { id:"ca12", skill:"simple-tenses", type:"slots", dir:"Change the underlined word to fit the sentence.",
    text:"Jin [cry>cried:cry,cryed,cried,cries] at the end of the movie yesterday." },
  { id:"ca13", skill:"simple-tenses", type:"slots", dir:D_ONE, opts:["visit","visited","will visit","have visited","am visiting","had visited"],
    text:"Next summer, we {will visit} our grandparents in Mexico." },
  { id:"ca14", skill:"perfect-tenses", type:"slots", dir:"Change the underlined word to fit the sentence.",
    text:"I have [eat>eaten:eat,ate,eaten,eated] sushi many times." },
  { id:"ca15", skill:"perfect-tenses", type:"slots", dir:D_ONE, opts:["knows","knew","has known","had known","will know","is knowing"],
    text:"Sam {has known} Ana since they were five years old." },
  { id:"ca16", skill:"perfect-tenses", type:"slots", dir:D_ONE, opts:["starts","started","has started","had started","will have started","was starting"],
    text:"By the time I arrived, the movie {had started}." },
  { id:"ca17", skill:"progressive-tenses", type:"slots", dir:"Change the underlined word to fit the sentence. The answer can be one or two words.",
    text:"Be quiet! My brother [study>is studying:study,studies,is studying,studying] right now." },
  { id:"ca18", skill:"progressive-tenses", type:"slots", dir:D_ONE, opts:["cook","cooked","was cooking","will cook","am cooking","had cooked"],
    text:"My mom {was cooking} dinner when I got home." },
  { id:"ca19", skill:"modals-and-contractions", type:"slots", dir:"Change each underlined part into one word with an apostrophe ( ' ).",
    text:"We [are not>aren't:are not,aren't,arn't,are'nt] late, but you [will not>won't:will not,won't,willn't,wo'nt] be on time." },
  { id:"ca20", skill:"modals-and-contractions", type:"slots", dir:D_ONE, opts:["can","could","will","should","may","must"],
    text:"When I was five, I {could} swim, but now I can't. I forgot how!" }
  ]},

/* =================================================================
   6. CHECK B  = Advanced + Combining  (22 NEW items, 14 skills)
   ================================================================= */
{ id:"check-b", title:"Grammar Check B", short:"Check B",
  sub:"Advanced grammar + combining sentences in one test. New questions.", mirrors:"ELL Advanced + Intermediate",
  items:[
  { id:"cb01", skill:"pronouns-advanced", type:"slots", dir:"Fill in each blank. You can use a word more than once.", opts:["we","us","our","ours","ourselves"],
    text:"{we} made this poster by {ourselves}. The poster on the left is {ours}. Our teacher helped {us} with the title. {our} names are on the back." },
  { id:"cb02", skill:"pronouns-advanced", type:"slots", dir:"Choose the best words for each blank.", opts:["There are","There is","It is","They are","Is","Has"],
    text:"{There are} many people at the beach today. {It is} very hot." },
  { id:"cb03", skill:"articles-uncountable", type:"slots", dir:D_FIX,
    text:"Can you give me some [informations>information:informations,information,an information,informationes] about the [buses:bus,buses,buss,bus's] to Oakland?" },
  { id:"cb04", skill:"articles-uncountable", type:"slots", empty:true, dir:D_EMPTY, opts:["a","an","the"],
    text:"My dream is to become {a} nurse. I want to work in {a/the} hospital and help {} people. {the} work is hard, but I love {} science." },
  { id:"cb05", skill:"gerunds-infinitives", type:"slots", dir:"Fill in each blank. You can use a word more than once.", opts:["to learn","learning","learn","learned"],
    text:"I decided {to learn} to cook. {learning/to learn} new things is fun! Yesterday I {learned} a new recipe. My mom helps me {learn/to learn}." },
  { id:"cb06", skill:"gerunds-infinitives", type:"slots", dir:"Fill in each blank. You can use a word more than once.",
    opts:["interested","interesting","surprised","surprising"],
    text:"The science museum was very {interesting}. I was {surprised} by the dinosaur bones. My little brother was {interested} in the planets. The end of the tour was {surprising}." },
  { id:"cb07", skill:"confused-words", type:"slots", dir:"Fill in each blank. You can use a word more than once.", opts:["make","do"],
    text:"I need to {do} my homework. Then I will {make} dinner. Please don't {make} a mess! Can you {do} me a favor?" },
  { id:"cb08", skill:"confused-words", type:"slots", dir:"Fill in each blank.", opts:["few","little","a few","a little"],
    text:"I have {a few} friends here, so I am not lonely. I speak {a little} English, and I am learning more. Hurry! There is very {little} time left." },
  { id:"cb09", skill:"question-forms", type:"order", dir:"Put the words in the correct order.",
    pre:"I don't know", tiles:["is","my","old","teacher","how"], post:".",
    accept:["I don't know how old my teacher is."] },
  { id:"cb10", skill:"question-forms", type:"slots", dir:"Fill in each blank.", opts:["I did","I finished","I do","did he","didn't he","does he","he did"],
    text:"Question: Did you finish your lunch? Answer: Yes, {I did}. Your friend didn't finish his lunch, {did he}?" },
  { id:"cb11", skill:"compound-subjects", type:"write", dir:D_AND, words:["and"],
    prompt:"Apples grow on trees. Oranges grow on trees.",
    accept:["Apples and oranges grow on trees.","Oranges and apples grow on trees."] },
  { id:"cb12", skill:"compound-objects", type:"write", dir:D_AND, words:["and"],
    prompt:"Kim bought eggs. Kim bought milk. Kim bought rice.",
    accept:LIST3("Kim bought ","eggs","milk","rice") },
  { id:"cb13", skill:"compound-predicates", type:"write", dir:D_AND, words:["and"],
    prompt:"Bats sleep during the day. Bats hunt at night.",
    accept:["Bats sleep during the day and hunt at night."] },
  { id:"cb14", skill:"compound-predicates", type:"write", dir:D_AND, words:["and"],
    prompt:"Students can read books in the library after school. Students can use computers in the library after school.",
    accept:["Students can read books and use computers in the library after school.",
            "Students can read books and can use computers in the library after school.",
            "After school, students can read books and use computers in the library."] },
  { id:"cb15", skill:"appositives", type:"write", dir:D_APPO,
    prompt:"Mr. Lee is our math teacher. Mr. Lee loves chess.",
    accept:["Mr. Lee, our math teacher, loves chess."] },
  { id:"cb16", skill:"compound-sentences", type:"write", dir:D_BEST, words:["and","or","but","so"],
    prompt:"The store was closed. We went home.",
    accept:["The store was closed, so we went home."] },
  { id:"cb17", skill:"compound-sentences", type:"write", dir:D_BEST, words:["and","or","but","so"],
    prompt:"You can take the bus. You can walk.",
    accept:["You can take the bus, or you can walk."] },
  { id:"cb18", skill:"complex-sentences", type:"write", dir:D_BEST, words:["although","because","unless"],
    prompt:"Plants need sunlight. They make their food from light.",
    accept:["Plants need sunlight because they make their food from light.",
            "Because they make their food from light, plants need sunlight."] },
  { id:"cb19", skill:"complex-sentences", type:"write", dir:D_BEST, words:["although","if","because"],
    prompt:"It was raining. We played soccer.",
    accept:["Although it was raining, we played soccer.","We played soccer although it was raining."] },
  { id:"cb20", skill:"compound-complex-basic", type:"write", dir:D_BOTH, words:["but","because"],
    prompt:"I like summer. My sister likes winter. She loves snow.",
    accept:["I like summer, but my sister likes winter because she loves snow."] },
  { id:"cb21", skill:"compound-complex-advanced", type:"write", dir:D_BOTH, words:["when","so"],
    prompt:"The power went out. It was very dark. We lit candles.",
    accept:["When the power went out, it was very dark, so we lit candles.",
            "It was very dark when the power went out, so we lit candles."] },
  { id:"cb22", skill:"conjunctive-adverbs", type:"write", dir:D_ADV, words:["however","therefore","in addition"],
    prompt:"Leo studied all night. He failed the test.",
    accept:CONJ("Leo studied all night","however","he failed the test") }
  ]}
];

/* ---------- warm-up items (not scored): teach HOW the test works ---------- */
var WARMUPS = {
  slots_empty: { id:"w1", type:"slots", empty:true, opts:["a","the"],
    dir:"Tap a blank. Then tap a word. Some blanks need NO word \u2014 choose \u2205 for those.",
    text:"I have {a} cat. My cat is {} black." },
  slots_fix: { id:"w2", type:"slots",
    dir:"Tap an underlined word to change it. If the word is already right, leave it.",
    text:"Yesterday I [walk>walked:walk,walks,walked] to [school:school,schools,schooled]." },
  order: { id:"w3", type:"order", dir:"Tap the words in the correct order. Tap a word again to take it back.",
    tiles:["pizza","like","I"], post:".", accept:["I like pizza."] },
  write: { id:"w4", type:"write", dir:"Type one sentence. Use the joining word.", words:["and"],
    prompt:"I like cats. I like dogs.", accept:["I like cats and dogs.","I like dogs and cats."] }
};
