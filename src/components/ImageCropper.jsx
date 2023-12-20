import { useState } from 'react';
import ReactCrop from 'react-image-crop';
import PropTypes from 'prop-types';
import 'react-image-crop/dist/ReactCrop.css';

const ImageCropper = ({ src, onCropComplete }) => {
  const [crop, setCrop] = useState({ aspect: 1 });

  const handleOnCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const handleOnCropComplete = (crop) => {
    if (onCropComplete) {
      onCropComplete(crop);
    }
  };

  return (
    <div>
      {src && (
        <ReactCrop
          src={src}
          crop={crop}
          onChange={handleOnCropChange}
          onComplete={handleOnCropComplete}
        />
      )}
    </div>
  );
};

ImageCropper.propTypes = {
  src: PropTypes.string.isRequired,
  onCropComplete: PropTypes.func
};

export default ImageCropper;
