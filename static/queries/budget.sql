select category, month, year, budgeted, sum(outflow)-sum(inflow) as spent
from 
(
select (case when (t.category is null) then b.name else t.category end),
				(case when (b.month is null) then extract(month from t.date) else b.month end), 
				(case when (b.year is null) then extract(year from t.date) else b.year end), 
				(case when (b.amount is null) then 0 else b.amount end) as budgeted,
				(case when (t.inflow is null) then 0 else t.inflow end) as inflow, 
				(case when (t.outflow is null) then 0 else t.outflow end) as outflow
				from transaction as t full outer join budget as b on b.name=t.category and extract(month from t.date) = b.month and extract(year from t.date) = b.year
) a
where month = ? and year = ?
group by category, month, year, budgeted
;