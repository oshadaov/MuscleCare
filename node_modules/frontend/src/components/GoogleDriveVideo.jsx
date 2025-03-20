const GoogleDriveVideo = ({ fileId }) => {
    const videoSrc = `https://drive.google.com/uc?export=preview&id=${fileId}`;
  
    return (
      <iframe
        width="800"
        height="450"
        src={videoSrc}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      ></iframe>
    );
  }

  export default GoogleDriveVideo