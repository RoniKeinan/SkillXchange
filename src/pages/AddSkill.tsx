import React, { useState, CSSProperties, useRef } from 'react';
import { useCategoryContext } from '../contexts/CategoryContext';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { useSkillContext } from '../contexts/SkillsContext';
import { useEffect } from 'react';

const containerStyle: CSSProperties = {
  maxWidth: '510px',
  margin: '48px auto',
  padding: '2.6rem 2.2rem 2rem 2.2rem',
  borderRadius: '1.2rem',
  boxShadow: '0 8px 36px 0 rgba(59,130,246,0.14)',
  background: '#fff',
  fontFamily: 'inherit',
};

const headingStyle: CSSProperties = {
  textAlign: 'center',
  marginBottom: '2.1rem',
  fontWeight: 800,
  fontSize: '2.1rem',
  color: '#3730a3',
  letterSpacing: '-0.5px'
};

const formGroupStyle: CSSProperties = {
  marginBottom: '1.1rem',
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle: CSSProperties = {
  display: 'block',
  marginBottom: '0.55rem',
  fontWeight: 700,
  color: '#6366f1',
  fontSize: '1.07rem',
};

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '0.85rem 1rem',
  borderRadius: '0.7rem',
  border: '1.5px solid #c7d2fe',
  background: '#f1f5fd',
  fontSize: '1.05rem',
  color: '#334155',
  fontWeight: 500,
  transition: 'border 0.16s, background 0.16s',
  outline: 'none',
  marginTop: '0.03rem',
  boxSizing: 'border-box',
};

const selectStyle: CSSProperties = {
  ...inputStyle,
};

const buttonStyle: CSSProperties = {
  width: '100%',
  padding: '1rem',
  background: 'linear-gradient(90deg, #818cf8, #3b82f6)',
  color: '#fff',
  fontWeight: 700,
  border: 'none',
  borderRadius: '0.8rem',
  fontSize: '1.13rem',
  cursor: 'pointer',
  boxShadow: '0 2px 8px #dbeafe',
  marginTop: '1.3rem',
  transition: 'background 0.19s, transform 0.14s',
  outline: 'none',
};

const buttonHover: CSSProperties = {
  background: 'linear-gradient(90deg, #6366f1 75%, #3b82f6 100%)',
  transform: 'scale(1.025)'
};

const imagePreviewRow: CSSProperties = {
  display: 'flex',
  gap: '1.1rem',
  margin: '0.6rem 0 0.3rem 0',
  flexWrap: 'wrap',
  alignItems: 'center',
};

const imagePreview: CSSProperties = {
  width: '68px',
  height: '68px',
  borderRadius: '0.6rem',
  objectFit: 'cover',
  boxShadow: '0 2px 8px #e0e7ff',
  border: '2px solid #818cf8',
  background: '#f3f4f6',
};

const AddSkillPage: React.FC = () => {
  const navigate = useNavigate();
  const { getAllSkills } = useSkillContext();
  const { categories, addCategory } = useCategoryContext();
  const { user ,setUser} = useUserContext();
  const [images, setImages] = useState<string[]>([]);
  const [skillName, setSkillName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isHovered, setIsHovered] = useState(false);

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
    userId: user.id,
    images: images,
  };

  try {
    const response = await fetch('https://nnuizx91vd.execute-api.us-east-1.amazonaws.com/dev/Skills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result = await response.json();
      alert('Skill added successfully!');
      setSkillName('');
      setDescription('');
      setSelectedCategory('');
      setNewCategoryName('');
      setImages([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      
      if (result.updatedUser) {
        setUser(result.updatedUser);
      } else {
        // אחרת, תקרא לפונקציה שמביאה את היוזר מהשרת
        const userResponse = await fetch(`https://nnuizx91vd.execute-api.us-east-1.amazonaws.com/dev/User?id=${user.id}`);
        if (userResponse.ok) {
          const updatedUser = await userResponse.json();
          setUser(updatedUser);
        }
      }
      

      await getAllSkills();
      navigate('/');
    } else {
     
      alert('Failed to add skill.');
    }
  } catch (error) {
    alert('An error occurred while adding the skill.');
  }
};

 useEffect(() => {
  console.log(user)
  console.log(user?.mySkills);
}, [user]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #e0e7ff 0%, #f9fafb 60%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={containerStyle}>
        <h2 style={headingStyle}>Add New Skill</h2>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Skill Name</label>
          <input
            type="text"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            style={inputStyle}
            placeholder="Enter skill name"
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...inputStyle, height: '88px', resize: 'vertical' }}
            placeholder="Enter a brief description"
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Category</label>
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
            <label style={labelStyle}>New Category Name</label>
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
          <label style={labelStyle}>Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
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
            style={{ ...inputStyle, padding: '0.7rem 0' }}
          />
        </div>

        {images.length > 0 && (
          <div style={imagePreviewRow}>
            {images.map((img, idx) => (
              <img src={img} key={idx} alt={`preview ${idx + 1}`} style={imagePreview} />
            ))}
          </div>
        )}

        <button
          style={isHovered ? { ...buttonStyle, ...buttonHover } : buttonStyle}
          onClick={handleAddSkill}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Add Skill
        </button>
      </div>
    </div>
  );
};

export default AddSkillPage;
