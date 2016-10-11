select category, month, year, budgeted, sum(outflow)-sum(inflow) as spent,
	printf("%.2f", budgeted - (sum(outflow)-sum(inflow))) as remaining
from
(
select (case when (t.category is null) then b.name else t.category end) as category,
				(case when (b.month is null) then strftime('%m', date) else cast(b.month as text) end) as month,
				(case when (b.year is null) then  strftime('%Y', date) else cast(b.year as text) end) as year,
				(case when (b.amount is null) then 0 else b.amount end) as budgeted,
				(case when (t.inflow is null) then 0 else t.inflow end) as inflow,
				(case when (t.outflow is null) then 0 else t.outflow end) as outflow
				from budget as b left outer join transactions as t on b.name=t.category
					and strftime('%m', date) = b.month and  strftime('%Y', date) = b.year
) a
where month = ? and year = ?
group by category, month, year, budgeted
;