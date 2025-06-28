/**
 * Calcula em qual semana do mês uma data se encontra, a partir do ano, mês e dia.
 * @param {number} year - O ano da data.
 * @param {number} month - O mês da data (1 para Janeiro, 12 para Dezembro).
 * @param {number} day - O dia da data.
 * @returns {number} - O número da semana no mês (1, 2, 3, 4 ou 5).
 */
export const getWeekOfMonthFromParts = (year: number, month: number, day: number) => {
    // Em JavaScript, os meses no construtor de Date são baseados em zero (0 = Janeiro, 11 = Dezembro).
    // Por isso, subtraímos 1 do mês que recebemos.
    const date = new Date(year, month - 1, day);

    // Validação para garantir que a data criada é válida e corresponde aos parâmetros.
    // Ex: Se o usuário passar (2025, 2, 30), o JS criaria "1 de Março". Esta validação evita isso.
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    throw new Error(`Data inválida: ${day}/${month}/${year} não existe.`);
    }

    // A fórmula para calcular a semana.
    // Math.floor arredonda o resultado da divisão para baixo.
    return Math.floor((day - 1) / 7) + 1;
};
