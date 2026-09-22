/* ============================================================
   items.js — grammar units for Mr. Toby's practice engine.

   To add a unit, copy a block and change it. Nothing else to edit.
     slug   : the web address, /readings/grammar/?u=SLUG
     skills : the tags that feed the coloured skill bars
     items  : prompt uses ___ for the blank
              answer  = the correct word
              choices = the word bank shown to the student
              skill   = which target skill this one prompt tests
   ============================================================ */
var UNITS = [
{
  slug: 'for-to-with-1',
  title: 'For, To, and With 1',
  level: '103',
  directions: 'Fill in the blank with the correct word.',
  skills: ['other-prepositions','prepositions-of-direction','infinitive-phrases'],
  items: [
    {prompt:'This backpack is ___ my little brother.', answer:'for',
     choices:['for','to','with'], skill:'other-prepositions',
     why:'We use <b>for</b> to show who receives something.'},
    {prompt:'Does your sister walk ___ school every morning?', answer:'to',
     choices:['for','to','with'], skill:'prepositions-of-direction',
     why:'We use <b>to</b> to show the direction someone moves.'},
    {prompt:'I want ___ learn more English this year.', answer:'to',
     choices:['for','to','with'], skill:'infinitive-phrases',
     why:'After a verb like <b>want</b>, we use <b>to</b> + another verb.'},
    {prompt:'She eats lunch ___ her cousins.', answer:'with',
     choices:['for','to','with'], skill:'other-prepositions',
     why:'We use <b>with</b> to show who is together.'},
    {prompt:'My family stayed in Oakland ___ three weeks.', answer:'for',
     choices:['for','to','with'], skill:'other-prepositions',
     why:'We use <b>for</b> with a length of time.'},
    {prompt:'Marco buys flowers ___ his grandmother.', answer:'for',
     choices:['for','to','with'], skill:'other-prepositions',
     why:'We use <b>for</b> to show who receives something.'},
    {prompt:'These new books are ___ the ELD class.', answer:'for',
     choices:['for','to','with'], skill:'other-prepositions',
     why:'We use <b>for</b> to show who something is meant for.'},
    {prompt:'I take the bus ___ the library after school.', answer:'to',
     choices:['for','to','with'], skill:'prepositions-of-direction',
     why:'We use <b>to</b> to show where someone is going.'},
    {prompt:'We do not write ___ red pens on the test.', answer:'with',
     choices:['for','to','with'], skill:'other-prepositions',
     why:'We use <b>with</b> to show the tool someone uses.'},
    {prompt:'He plays basketball ___ his friends on Saturday.', answer:'with',
     choices:['for','to','with'], skill:'other-prepositions',
     why:'We use <b>with</b> to show who is together.'},
    {prompt:'My mother needs ___ call the doctor today.', answer:'to',
     choices:['for','to','with'], skill:'infinitive-phrases',
     why:'After a verb like <b>need</b>, we use <b>to</b> + another verb.'},
    {prompt:'They study hard ___ the science quiz.', answer:'for',
     choices:['for','to','with'], skill:'other-prepositions',
     why:'We use <b>for</b> to show the reason or purpose.'}
  ]
},
{
  slug: 'in-on-at-time',
  title: 'In, On, and At: Time',
  level: '103',
  directions: 'Fill in the blank with the correct word.',
  skills: ['prepositions-of-time'],
  items: [
    {prompt:'Our class starts ___ 8:30 in the morning.', answer:'at',
     choices:['in','on','at'], skill:'prepositions-of-time',
     why:'We use <b>at</b> with a clock time.'},
    {prompt:'My birthday is ___ March.', answer:'in',
     choices:['in','on','at'], skill:'prepositions-of-time',
     why:'We use <b>in</b> with a month.'},
    {prompt:'We have a test ___ Friday.', answer:'on',
     choices:['in','on','at'], skill:'prepositions-of-time',
     why:'We use <b>on</b> with a day of the week.'},
    {prompt:'She came to San Francisco ___ 2023.', answer:'in',
     choices:['in','on','at'], skill:'prepositions-of-time',
     why:'We use <b>in</b> with a year.'},
    {prompt:'The library closes ___ six o\'clock.', answer:'at',
     choices:['in','on','at'], skill:'prepositions-of-time',
     why:'We use <b>at</b> with a clock time.'},
    {prompt:'I visit my aunt ___ the weekend.', answer:'on',
     choices:['in','on','at'], skill:'prepositions-of-time',
     why:'In American English we use <b>on</b> with the weekend.'},
    {prompt:'It rains a lot here ___ the winter.', answer:'in',
     choices:['in','on','at'], skill:'prepositions-of-time',
     why:'We use <b>in</b> with a season.'},
    {prompt:'We eat dinner ___ night.', answer:'at',
     choices:['in','on','at'], skill:'prepositions-of-time',
     why:'We say <b>at night</b>, but <b>in the morning</b>.'},
    {prompt:'My brother was born ___ September 14.', answer:'on',
     choices:['in','on','at'], skill:'prepositions-of-time',
     why:'We use <b>on</b> with a full date.'},
    {prompt:'She studies English ___ the afternoon.', answer:'in',
     choices:['in','on','at'], skill:'prepositions-of-time',
     why:'We use <b>in</b> with the morning, the afternoon, the evening.'}
  ]
}
];
