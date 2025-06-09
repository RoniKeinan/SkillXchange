import React, { useState, useEffect } from 'react';
import { useUserContext } from '../contexts/UserContext';

interface User {
 id:string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    birthDate: string;
    city: string;
    street: string;
    houseNumber: string;
    image: string;
}

const EditProfile: React.FC = () => {
    const { user ,setUser} = useUserContext();

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
        setupdatedUser(user);
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
            reader.readAsDataURL(file); // Converts the image to a base64 string
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
     

        try {
            const response = await fetch('https://rrhrxoqc2j.execute-api.us-east-1.amazonaws.com/dev/User', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateduser),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('User updated successfully:', data);
              setUser(data.updatedUser)
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
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
                        <label style={styles.label}>{field.label}:</label>
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

                <div style={styles.formGroup}>
                    <label style={styles.label}>Profile Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={styles.input}
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
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '40px auto',
        padding: '20px',
        background: '#fafafa',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        textAlign: 'center' as const,
        marginBottom: '20px',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    input: {
        width: '100%',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box' as const,
    },
    imagePreview: {
        textAlign: 'center' as const,
        margin: '20px 0',
    },
    image: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        objectFit: 'cover' as const,
        border: '2px solid #ccc',
    },
    button: {
        display: 'block',
        width: '100%',
        backgroundColor: '#4CAF50',
        color: 'white',
        fontWeight: 'bold',
        padding: '10px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    buttonHover: {
        backgroundColor: '#45a049',
    },
};

export default EditProfile;
