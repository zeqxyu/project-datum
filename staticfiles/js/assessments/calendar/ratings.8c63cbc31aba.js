import { menu_data } from '/static/js/core/main_template/temp_data.js'
import { assessment_data } from './temp_data.js';

export const hasRated = false // позже будет браться из BD
// const hasAnyDatum = assessment_data.datums.some(d => d.student === menu_data.student_data.username);
const hasAnyDatum = false;

// переменная с рейтингами
export let savedRatings = {};

if (!hasRated && !hasAnyDatum && assessment_data.stage === 1) {
	savedRatings = {
		"student": menu_data.student_data.username,
		"assessment": assessment_data.code,
		"date_ratings": []
	};
} else {
	// TODO: если уже зарейтил - берем из БД
	savedRatings = {
		"student": menu_data.student_data.username,
		"assessment": assessment_data.code,
		"date_ratings": [
			{
				"date": "2024-11-28",
				"value": 1,
			},
			{
				"date": "2024-12-12",
				"value": -1,
			},
			{
				"date": "2025-01-02",
				"value": -1,
			},
			{
				"date": "2024-12-19",
				"value": 1,
			},
			{
				"date": "2024-12-26",
				"value": 1,
			},
			{
				"date": "2025-01-16",
				"value": -1,
			}
		]
	}
}

// вспомогательная функция
export function getAviableRatings() {
	let pluses = savedRatings.date_ratings.filter(r => r.value === 1).length;
	let minuses = savedRatings.date_ratings.filter(r => r.value === -1).length;

	return {
		aviablePluses: 3 - pluses,
		aviableMinuses: 3 - minuses
	};
}

// добавляет/удаляет рейтинги в savedRatings
export function toggleRating(date, value) {
	// value: 1 (плюс), -1 (минус), 0 (отмена)

	// если отмена -> удалить из списка
	if (value === 0) {
		savedRatings.date_ratings = savedRatings.date_ratings.filter(r => r.date !== date);
		console.log("Удалено:", date);
		console.log("Текущее состояние:", savedRatings);
        return;
	}

	// проверяем, сколько уже плюсов/минусов
	const pluses = savedRatings.date_ratings.filter(r => r.value === 1).length;
	const minuses = savedRatings.date_ratings.filter(r => r.value === -1).length;

	if ((value === 1 && pluses >= 3) || (value === -1 && minuses >= 3)) {
		alert("Omejitev: samo 3 ovrednotenja istega tipa");
		return;
	}

	// проверяем, есть ли уже рейтинг для этой даты
	const existingIndex = savedRatings.date_ratings.findIndex(r => r.date === date);

	if (existingIndex !== -1) {
		// заменяем значение (например, поменяли + на -)
		savedRatings.date_ratings[existingIndex].value = value;
	} else {
		// добавляем новый
		savedRatings.date_ratings.push({ date, value });
	}

	console.log("Текущее состояние:", savedRatings);
	console.log("Pluses left:", getAviableRatings().aviablePluses);
	console.log("Minuses left:", getAviableRatings().aviableMinuses);
}


