import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const CopyToClipboardButton = ({ text }) => {
  const copyToClipboard = (e) => {
    navigator.clipboard.writeText(text).then(() => {
      // Opcional: Mostrar alguna notificación de éxito
      console.log('Texto copiado al portapapeles');
    }).catch(err => {
      console.error('Error al copiar texto: ', err);
    });
    e.stopPropagation(); // Prevenir cualquier otra acción que pudiera desencadenarse
  };

  return (
    <button onClick={copyToClipboard} className="btn btn-sm btn-outline-secondary" style={{marginLeft: "5px"}}>
      <FontAwesomeIcon icon={faCopy} />
    </button>
  );
};

export default CopyToClipboardButton;
