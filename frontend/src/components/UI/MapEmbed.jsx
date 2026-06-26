import React from 'react';

const MapEmbed = ({ mapSourceUrl, height = 450 }) => {
  return (
    <div style={{ width: '100%', overflow: 'hidden', borderRadius: '8px' }}>
      <iframe
        title="Google Map Embed"
        src={mapSourceUrl}
        width="100%"
        height={height}
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default MapEmbed;
