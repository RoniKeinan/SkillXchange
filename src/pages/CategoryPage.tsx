import React from 'react';
import { useParams } from 'react-router-dom';
import { useSkillContext } from '../contexts/SkillsContext';

const CategoryPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const { skills } = useSkillContext();

  // Filter skills by category name (case-insensitive)
  const filteredSkills = skills.filter(
    (skill) => skill.category.toLowerCase() === name?.toLowerCase()
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Skills in "{name}" Category</h2>
      {filteredSkills.length > 0 ? (
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {filteredSkills.map((skill) => (
            <li key={skill.id} style={{ marginBottom: '1rem' }}>
              <strong>{skill.name}</strong>
              <p>{skill.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No skills found in this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;
