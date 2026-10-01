-- 1) Practice pages can now record "right on the first try" per skill.
alter table skill_attempts add column if not exists n_first int;

-- 2) A small new view. It does NOT change student_skills or the teacher dashboard.
--    lp         = the part of the email before @ (so @s.sfusd.edu and @sfusd.edu count as one student)
--    latest_pct = the student's most recent round for that skill
--    rounds     = how many rounds of that skill they have done
--    star_round = the round number of their first perfect round (null = no star yet)
--                 perfect = every answer right on the first try
drop view if exists student_skill_status;
create view student_skill_status as
with r as (
  select split_part(lower(email), '@', 1) as lp, skill, n, d, coalesce(n_first, n) as nf,
         row_number() over (partition by split_part(lower(email), '@', 1), skill order by completed_at, id)           as rn,
         row_number() over (partition by split_part(lower(email), '@', 1), skill order by completed_at desc, id desc) as rdesc
  from skill_attempts
  where email is not null and skill is not null and d > 0
)
select lp, skill,
       max(case when rdesc = 1 then round(100.0 * n / d)::int end) as latest_pct,
       max(rn)::int                                                  as rounds,
       min(case when nf >= d then rn end)::int                       as star_round
from r
group by lp, skill;

notify pgrst, 'reload schema';
