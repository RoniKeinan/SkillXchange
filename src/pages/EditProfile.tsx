import React, { useState, useEffect } from 'react';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    birthDate: string;
    city: string;
    street: string;
    houseNumber: string;
    image?: string;
}

const EditProfile: React.FC = () => {
    const { user, setUser } = useUserContext();
    const navigate = useNavigate();

    const [updateduser, setupdatedUser] = useState<User>({
        id: user?.id || '',
        firstName: '',
        lastName: '',
        phone: '',
        email: user?.email || '',
        birthDate: '',
        city: '',
        street: '',
        houseNumber: '',
        image: '',
    });

    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (user) {
            setupdatedUser({
                ...user,
                image: user.image || '',
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setupdatedUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setupdatedUser((prevUser) => ({
                    ...prevUser,
                    image: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const cleanedUser: Partial<User> = { ...updateduser };
        if (!cleanedUser.image || cleanedUser.image.trim() === "") {
            delete cleanedUser.image;
        }
        try {
            const response = await fetch('https://nnuizx91vd.execute-api.us-east-1.amazonaws.com/dev/User', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cleanedUser),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setUser(data.updatedUser);
            navigate('/ProfileScreen');
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div style={styles.bg}>
            <div style={styles.container}>
                <h2 style={styles.heading}>Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div style={styles.grid}>
                        {[
                            { label: 'First Name', name: 'firstName' },
                            { label: 'Last Name', name: 'lastName' },
                            { label: 'Email', name: 'email', type: 'email' },
                            { label: 'Phone', name: 'phone', type: 'tel' },
                            { label: 'Birth Date', name: 'birthDate', type: 'date' },
                            { label: 'City', name: 'city' },
                            { label: 'Street', name: 'street' },
                            { label: 'House Number', name: 'houseNumber' },
                        ].map((field) => (
                            <div key={field.name} style={styles.formGroup}>
                                <label style={styles.label}>{field.label}</label>
                                <input
                                    type={field.type || 'text'}
                                    name={field.name}
                                    value={(updateduser as any)[field.name]}
                                    onChange={handleChange}
                                    required={
                                        field.name === 'firstName' ||
                                        field.name === 'lastName' ||
                                        field.name === 'email'
                                    }
                                    style={styles.input}
                                />
                            </div>
                        ))}
                    </div>

                    <div style={{ ...styles.formGroup, marginTop: 14 }}>
                        <label style={styles.label}>Profile Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={styles.fileInput}
                        />
                    </div>

                    {updateduser.image && (
                        <div style={styles.imagePreview}>
                            <img src={updateduser.image} alt="Profile" style={styles.image} />
                        </div>
                    )}

                    <button
                        type="submit"
                        style={{
                            ...styles.button,
                            ...(isHovered ? styles.buttonHover : {}),
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    bg: {
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #e0e7ff 0%, #f9fafb 60%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        width: '100%',
        maxWidth: '510px',
        margin: '36px auto',
        background: '#fff',
        borderRadius: '1.3rem',
        boxShadow: '0 8px 38px 0 rgba(59,130,246,0.13)',
        padding: '2.6rem 2.4rem 2.1rem 2.4rem',
        fontFamily: 'inherit',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
    },
    heading: {
        textAlign: 'center' as const,
        marginBottom: '2rem',
        fontWeight: 800,
        fontSize: '2.2rem',
        color: '#3730a3',
        letterSpacing: '-0.5px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '1.2rem',
        width: '100%',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column' as const,
        marginBottom: '0.25rem',
    },
    label: {
        fontWeight: 600,
        marginBottom: '0.42rem',
        color: '#6366f1',
        fontSize: '1.08rem',
    },
    input: {
        width: '100%',
        padding: '0.7rem 1rem',
        border: '1.5px solid #c7d2fe',
        borderRadius: '0.7rem',
        fontSize: '1.05rem',
        color: '#334155',
        fontWeight: 500,
        background: '#f1f5fd',
        transition: 'border 0.15s, background 0.15s',
        outline: 'none',
        marginTop: '0.03rem',
    },
    fileInput: {
        padding: '0.6rem 0',
        fontSize: '1.02rem',
        border: 'none',
        background: 'transparent',
    },
    imagePreview: {
        textAlign: 'center' as const,
        margin: '20px 0 14px 0',
    },
    image: {
        width: '98px',
        height: '98px',
        borderRadius: '50%',
        objectFit: 'cover' as const,
        border: '3px solid #818cf8',
        boxShadow: '0 2px 12px #e0e7ff',
        background: '#f3f4f6',
    },
    button: {
        marginTop: '1.8rem',
        width: '100%',
        background: 'linear-gradient(90deg, #818cf8, #3b82f6)',
        color: '#fff',
        fontWeight: 700,
        padding: '0.95rem',
        border: 'none',
        borderRadius: '0.8rem',
        fontSize: '1.13rem',
        cursor: 'pointer',
        boxShadow: '0 2px 8px #dbeafe',
        transition: 'background 0.16s, transform 0.14s',
        outline: 'none',
    },
    buttonHover: {
        background: 'linear-gradient(90deg, #6366f1 75%, #3b82f6 100%)',
        transform: 'scale(1.025)'
    },
};

export default EditProfile;
