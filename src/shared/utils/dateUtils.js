export const formatDate = (dateString) => {
    if (!dateString) return "Отсутствует";
    return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}; 