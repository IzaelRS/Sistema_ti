const acc = {
    type: 'Recorrente',
    due_date: '2026-03-03',
    frequency: 'Dia'
};

function isEventOnDate(acc, targetYear, targetMonth, targetDay) {
    if (!acc.due_date) return false;
    const [cYearStr, cMonthStr, cDayStr] = acc.due_date.split('-');
    const cYear = parseInt(cYearStr, 10);
    const cMonth = parseInt(cMonthStr, 10) - 1;
    const cDay = parseInt(cDayStr, 10);

    if (acc.type === 'Único') {
        return (targetYear === cYear && targetMonth === cMonth && targetDay === cDay);
    }

    if (acc.type === 'Recorrente') {
        const startObjNoTime = new Date(cYear, cMonth, cDay).setHours(0, 0, 0, 0);
        const targetObjNoTime = new Date(targetYear, targetMonth, targetDay).setHours(0, 0, 0, 0);

        if (targetObjNoTime < startObjNoTime) return false;

        const freq = acc.frequency || 'Mensal';

        if (['Mensal', '3 Meses', '6 Meses', 'Ano'].includes(freq)) {
            const diffMonths = (targetYear - cYear) * 12 + (targetMonth - cMonth);
            const daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
            const expectedDay = Math.min(cDay, daysInTargetMonth);

            if (targetDay !== expectedDay) return false;
            if (diffMonths < 0) return false;

            if (freq === 'Mensal') return true;
            if (freq === '3 Meses') return diffMonths % 3 === 0;
            if (freq === '6 Meses') return diffMonths % 6 === 0;
            if (freq === 'Ano') return targetMonth === cMonth;
        } else {
            const utc1 = Date.UTC(cYear, cMonth, cDay);
            const utc2 = Date.UTC(targetYear, targetMonth, targetDay);
            const diffDays = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));

            if (freq === 'Dia') return true;
            if (freq === 'Semana') return diffDays % 7 === 0;
            if (freq === '15 Dias') return diffDays % 15 === 0;
        }
    }
    return false;
}

console.log('Dia freq on 2026-03-04 (1 day diff):', isEventOnDate(acc, 2026, 2, 4));
console.log('Semana freq on 2026-03-10 (7 day diff):', isEventOnDate({ ...acc, frequency: 'Semana' }, 2026, 2, 10));
console.log('15 Dias freq on 2026-03-18 (15 day diff):', isEventOnDate({ ...acc, frequency: '15 Dias' }, 2026, 2, 18));
console.log('Mensal freq on 2026-04-03:', isEventOnDate({ ...acc, frequency: 'Mensal' }, 2026, 3, 3));
console.log('Ano freq on 2027-03-03:', isEventOnDate({ ...acc, frequency: 'Ano' }, 2027, 2, 3));
