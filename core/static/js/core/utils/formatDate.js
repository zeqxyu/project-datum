export function formatDateDM(dateStr) {
	const [year, month, day] = dateStr.split("-");
	return `${day}.${month}`;
}

export function formatDateDMY(dateStr) {
	const [year, month, day] = dateStr.split("-");
	return `${day}.${month}.${year}`;
}

