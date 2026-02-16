export const submitData = async (data) => {
  const response = await fetch(`http://127.0.0.1:9000/api/products/create/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // ОШИБКА БЫЛА ЗДЕСЬ: нужно преобразовать объект в строку
    body: JSON.stringify(data), 
  });

  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status}`);
  }

  return await response.json();
};