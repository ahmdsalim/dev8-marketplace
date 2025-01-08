import { useState } from "react";
import { PhotoSlider } from 'react-photo-view';

// eslint-disable-next-line react/prop-types
export default function ImageSlider({ images, triggerElement, containerClassName, ...props }) {
    const [visible, setVisible] = useState(false);
    const [index, setIndex] = useState(0);

    const TriggerElement = triggerElement;

    return (
      <>
        <div className={containerClassName}>
            <TriggerElement onClick={() => setVisible(true)} {...props}/>
        </div>

        <PhotoSlider
          // eslint-disable-next-line react/prop-types
          images={images.map((item) => ({ src: item, key: item }))}
          visible={visible}
          onClose={() => {
            setVisible(false);
            setIndex(0);
          }}
          index={index}
          onIndexChange={setIndex}
        />
      </>
    );
}
