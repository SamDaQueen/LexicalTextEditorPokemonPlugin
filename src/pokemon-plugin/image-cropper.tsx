import React, { useEffect, useRef } from "react";

/**
 * This component is used to crop the image to only retain the center portion.
 * @param imageUrl The URL of the image to crop
 */
const ImageCropper: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      // Calculate the new dimensions for the cropped image
      const croppedWidth = image.width / 2; // 50% of the original width
      const croppedHeight = image.height / 2; // 50% of the original height

      // Calculate the position for cropping (centered)
      const offsetX = (image.width - croppedWidth) / 2;
      const offsetY = (image.height - croppedHeight) / 2;

      // Set the canvas dimensions to match the cropped size
      canvas.width = croppedWidth;
      canvas.height = croppedHeight;

      // Draw the cropped portion of the image onto the canvas
      context.drawImage(
        image,
        offsetX,
        offsetY,
        croppedWidth,
        croppedHeight,
        0,
        0,
        croppedWidth,
        croppedHeight
      );
    };
  }, [imageUrl]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "25px", height: "25px", margin: "5px" }}
    />
  );
};

export default ImageCropper;
