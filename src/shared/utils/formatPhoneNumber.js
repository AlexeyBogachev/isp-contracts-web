export const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
  
    if (cleaned.startsWith('8')) {
      return '+7' + cleaned.slice(1);
    } else if (cleaned.startsWith('7')) {
      return '+' + cleaned;
    } else if (cleaned.length > 0) {
      return '+7' + cleaned;
    }
    return '';
  };