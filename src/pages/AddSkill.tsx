import React, { useState, CSSProperties, useRef } from 'react';
import { useCategoryContext } from '../contexts/CategoryContext';
import { useUserContext } from '../contexts/UserContext';

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
 
  const { categories, addCategory } = useCategoryContext();
  const { user } = useUserContext();
  const [images, setImages] = useState<string[]>([]);
  const [skillName, setSkillName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  const isAddingNewCategory = selectedCategory === 'new';

  // טיפוס נכון ל-ref של input קבצים
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAddSkill = async () => {
    const categoryName = isAddingNewCategory ? newCategoryName.trim() : selectedCategory;

    if (!skillName.trim() || !categoryName || !description.trim()) {
      alert('Please fill in all fields: skill name, category, and description.');
      return;
    }

    if (!user) {
      alert("You must be logged in to add a skill.");
      return;
    }

    const categoryExists = categories.some(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    if (!categoryExists && isAddingNewCategory) {
      addCategory(categoryName);
    }

    const payload = {
      title: skillName,
      category: categoryName,
      description: description,
      contactName: `${user.firstName} ${user.lastName}`,
      contactEmail: user.email,
      userId: user.email,
      images: images,
    };

    try {
      const response = await fetch('https://rrhrxoqc2j.execute-api.us-east-1.amazonaws.com/dev/Skill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Skill created:', result);
        alert('Skill added successfully!');

        // איפוס השדות כולל שדה הקבצים
        setSkillName('');
        setDescription('');
        setSelectedCategory('');
        setNewCategoryName('');
        setImages([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';  // איפוס שדה הקבצים
        }
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        alert('Failed to add skill.');
      }
    } catch (error) {
      console.error('Request failed:', error);
      alert('An error occurred while adding the skill.');
    }
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

      <div style={formGroupStyle}>
        <label style={labelStyle}>Upload Images:</label>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef} // כאן ה-ref
          onChange={async (e) => {
            if (!e.target.files) return;
            const files = Array.from(e.target.files);
            const base64Images = await Promise.all(
              files.map(file => {
                return new Promise<string>((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result === 'string') {
                      resolve(reader.result);
                    } else {
                      reject(new Error('FileReader result is not a string'));
                    }
                  };
                  reader.onerror = reject;
                  reader.readAsDataURL(file);
                });
              })
            );
            setImages(base64Images);
          }}
        />
      </div>

      <button style={buttonStyle} onClick={handleAddSkill}>
        Add Skill
      </button>
    </div>
  );
};

export default AddSkillPage;
