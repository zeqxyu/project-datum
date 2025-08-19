import { menu_data } from '/static/js/core/main_template/temp_data.js'

export let savedRatings = {
	"student": menu_data.student_data.username,
	"assessment": "1a24_matust1",
	"date_ratings": []
};

export function getAvailableRatings() {
	let pluses = savedRatings.date_ratings.filter(r => r.value === 1).length;
	let minuses = savedRatings.date_ratings.filter(r => r.value === -1).length;

	return {
		availablePluses: 3 - pluses,
		availableMinuses: 3 - minuses
	};
}

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
	console.log("Pluses left:", getAvailableRatings().availablePluses);
	console.log("Minuses left:", getAvailableRatings().availableMinuses);
}

