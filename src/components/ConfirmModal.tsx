import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '8px',
  maxWidth: '400px',
  width: '80%',
  boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
  textAlign: 'center',
};

const buttonGroupStyle: React.CSSProperties = {
  marginTop: '1.5rem',
  display: 'flex',
  justifyContent: 'space-around',
};

const buttonStyle: React.CSSProperties = {
  padding: '0.6rem 1.2rem',
  borderRadius: '5px',
  fontSize: '1rem',
  cursor: 'pointer',
  border: 'none',
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'Confirm Action',
  message,
  onConfirm,
  onCancel,
  confirmText = 'Yes',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;

  return (
    <div style={backdropStyle}>
      <div style={modalStyle}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div style={buttonGroupStyle}>
          <button
            style={{ ...buttonStyle, backgroundColor: '#dc3545', color: '#fff' }}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            style={{ ...buttonStyle, backgroundColor: '#6c757d', color: '#fff' }}
            onClick={onCancel}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
