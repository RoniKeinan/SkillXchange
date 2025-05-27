import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCategoryContext } from '../contexts/CategoryContext';
import { useUserContext } from '../contexts/UserContext';

const styles = {
  container: {
    maxWidth: '500px',
    margin: '2rem auto',
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fdfdfd',
  },
  heading: {
    marginBottom: '1.5rem',
    fontSize: '1.8rem',
    color: '#333',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#444',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  select: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

const EditSkillPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { skills ,updateSkill} = useUserContext();
  const { categories, addCategory } = useCategoryContext();

  const skill = skills.find(s => s.id === Number(id));
  const [skillName, setSkillName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  const isAddingNewCategory = selectedCategory === 'new';

  useEffect(() => {
    if (skill) {
      setSkillName(skill.name);
      setDescription(skill.description);
      setSelectedCategory(skill.category);
    }
  }, [skill]);

  if (!skill) return <p style={{ textAlign: 'center' }}>Skill not found</p>;

  const handleUpdateSkill = () => {
    const categoryName = isAddingNewCategory ? newCategoryName.trim() : selectedCategory;

    if (!skillName.trim() || !categoryName || !description.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    if (isAddingNewCategory && !categories.some(cat => cat.name.toLowerCase() === categoryName.toLowerCase())) {
      addCategory(categoryName);
    }

    updateSkill({
      ...skill,
      name: skillName,
      category: categoryName,
      description,
    });

    alert('✅ Skill updated!');
    navigate(-1); // חזרה אחורה
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Edit Skill</h2>

      <div style={styles.formGroup}>
        <label style={styles.label}>Skill Name:</label>
        <input
          type="text"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...styles.input, height: '80px', resize: 'vertical' }}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={styles.select}
        >
          <option value="">-- Select a category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
          <option value="new">+ Add new category</option>
        </select>
      </div>

      {isAddingNewCategory && (
        <div style={styles.formGroup}>
          <label style={styles.label}>New Category Name:</label>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            style={styles.input}
          />
        </div>
      )}

      <button style={styles.button} onClick={handleUpdateSkill}>
        Update Skill
      </button>
    </div>
  );
};

export default EditSkillPage;
