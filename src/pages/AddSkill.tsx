import React, { useState, CSSProperties } from 'react';
import { useSkillContext } from '../contexts/SkillsContext';
import { useCategoryContext } from '../contexts/CategoryContext';

const containerStyle: CSSProperties = {
  maxWidth: '500px',
  margin: '2rem auto',
  padding: '2rem',
  border: '1px solid #ddd',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#fdfdfd',
};

const headingStyle: CSSProperties = {
  textAlign: 'center',
  marginBottom: '1.5rem',
  fontSize: '1.8rem',
  color: '#333',
};

const formGroupStyle: CSSProperties = {
  marginBottom: '1rem',
};

const labelStyle: CSSProperties = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: 'bold',
  color: '#444',
};

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '0.5rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem',
};

const selectStyle: CSSProperties = {
  ...inputStyle,
};

const buttonStyle: CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer',
};

const AddSkillPage: React.FC = () => {
  const { addSkill } = useSkillContext();
  const { categories, addCategory } = useCategoryContext();

  const [skillName, setSkillName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  const isAddingNewCategory = selectedCategory === 'new';

  const handleAddSkill = () => {
    const categoryName = isAddingNewCategory ? newCategoryName.trim() : selectedCategory;

    if (!skillName.trim() || !categoryName || !description.trim()) {
      alert('Please fill in all fields: skill name, category, and description.');
      return;
    }

    const categoryExists = categories.some(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    if (!categoryExists && isAddingNewCategory) {
      addCategory(categoryName);
    }

    addSkill(skillName, categoryName, description);
    setSkillName('');
    setDescription('');
    setSelectedCategory('');
    setNewCategoryName('');
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Add New Skill</h2>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Skill Name:</label>
        <input
          type="text"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          style={inputStyle}
          placeholder="Enter skill name"
        />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
          placeholder="Enter a brief description"
        />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={selectStyle}
        >
          <option value="">-- Select a category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
          <option value="new">+ Add new category</option>
        </select>
      </div>

      {isAddingNewCategory && (
        <div style={formGroupStyle}>
          <label style={labelStyle}>New Category Name:</label>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            style={inputStyle}
            placeholder="Enter new category name"
          />
        </div>
      )}

      <button style={buttonStyle} onClick={handleAddSkill}>
        Add Skill
      </button>
    </div>
  );
};

export default AddSkillPage;
