export const submitData = async (data) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status}`);
  }

  return await response.json();
};