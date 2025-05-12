import React, { useState } from 'react';
import { useSkillContext } from '../contexts/SkillsContext';
import { useCategoryContext } from '../contexts/CategoryContext';

const AddSkill: React.FC = () => {
  const { addSkill } = useSkillContext();
  const { categories, addCategory } = useCategoryContext();

  const [skillName, setSkillName] = useState('');
  const [categoryName, setCategoryName] = useState('');

  const handleAddSkill = () => {
    if (!skillName.trim() || !categoryName.trim()) {
      alert('נא למלא שם סקיל וקטגוריה');
      return;
    }

    // בדוק אם הקטגוריה כבר קיימת
    const categoryExists = categories.some(
      (category) => category.name.toLowerCase() === categoryName.toLowerCase()
    );

    // הוסף קטגוריה אם אינה קיימת
    if (!categoryExists) {
      addCategory(categoryName);
    }

    // הוסף את הסקיל
    addSkill(skillName, categoryName);

    // איפוס הטופס
    setSkillName('');
    setCategoryName('');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>הוספת סקיל חדש</h2>
      <div>
        <label>
          שם הסקיל:
          <input
            type="text"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            style={{ margin: '0.5rem' }}
          />
        </label>
      </div>
      <div>
        <label>
          קטגוריה:
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            style={{ margin: '0.5rem' }}
          />
        </label>
      </div>
      <button onClick={handleAddSkill}>הוסף סקיל</button>
    </div>
  );
};

export default AddSkill;
