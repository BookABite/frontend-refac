export const simplifyHours = (hours: Record<string, string[]>) => {
    const daysMap = {
        Segunda: 'Seg',
        Terça: 'Ter',
        Quarta: 'Qua',
        Quinta: 'Qui',
        Sexta: 'Sex',
        Sábado: 'Sáb',
        Domingo: 'Dom',
    }

    // Verifica se todos os dias têm os mesmos horários
    const allDaysSame = Object.values(hours).every(
        (val, _, arr) => JSON.stringify(val) === JSON.stringify(arr[0])
    )

    if (allDaysSame) {
        return `Todos os dias: ${hours['Segunda']?.join(' e ')}`
    }

    // Verifica se dias úteis são iguais e fim de semana é igual
    const weekdays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']
    const weekend = ['Sábado', 'Domingo']

    const allWeekdaysSame = weekdays.every(
        (day) => JSON.stringify(hours[day]) === JSON.stringify(hours['Segunda'])
    )

    const allWeekendSame = weekend.every(
        (day) => JSON.stringify(hours[day]) === JSON.stringify(hours['Sábado'])
    )

    if (allWeekdaysSame && allWeekendSame) {
        return `
        ${daysMap['Segunda']}-${daysMap['Sexta']}: ${hours['Segunda']?.join(' e ')}<br />
        ${daysMap['Sábado']}-${daysMap['Domingo']}: ${hours['Sábado']?.join(' e ')}
      `
    }

    // Caso contrário, exibe todos os dias com seus respectivos horários
    return Object.entries(hours)
        .map(([day, times]) => `${daysMap[day as keyof typeof daysMap]}: ${times.join(' e ')}`)
        .join('<br />')
}
