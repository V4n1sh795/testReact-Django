import { useState } from 'react';
import { submitData } from '../api/submitApi';

function SubmitForm() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!value.trim()) {
      setError('Введите текст');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await submitData({
    name: value,
    price: 1000,
    description: 'dadsada'
  });
      setResult(data);
      setValue('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Отправка данных</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Введите текст..."
          style={styles.input}
          disabled={loading}
        />
        
        <button 
          type="submit" 
          style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1
          }}
          disabled={loading}
        >
          {loading ? 'Отправка...' : 'Отправить'}
        </button>
      </form>

      {error && <p style={styles.error}>❌ {error}</p>}
      
      {result && (
        <div style={styles.result}>
          <p style={styles.success}>✅ Успешно!</p>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    backgroundColor: '#ffe6e6',
    padding: '10px',
    borderRadius: '4px',
  },
  success: {
    color: 'green',
    fontWeight: 'bold',
  },
  result: {
    backgroundColor: '#f0f0f0',
    padding: '15px',
    borderRadius: '4px',
    marginTop: '15px',
  },
};

export default SubmitForm;