import ReactDOM from "react-dom";
import React, { useState, useRef } from "react";
import cn from "classnames";
import {
  Cropper,
  CropperRef,
  CropperPreview,
  CropperPreviewRef
} from "react-advanced-cropper";
import { AdjustablePreviewBackground } from "./components/AdjustablePreviewBackground";
import { Navigation } from "./components/Navigation";
import { Slider } from "./components/Slider";
import { AdjustableCropperBackground } from "./components/AdjustableCropperBackground";
import { Button } from "./components/Button";
import { ResetIcon } from "./icons/ResetIcon";
import "react-advanced-cropper/dist/style.css";
import "./styles.scss";

export const ImageEditor = ({ onNewImage }) => {
  
  const cropperRef = useRef<CropperRef>(null);
  const previewRef = useRef<CropperPreviewRef>(null);

  const [src, setSrc] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsmd5q9GM0qYRxqFlosf5we2GrE0LoWUIRHQ&s"
  );

  const [mode, setMode] = useState("crop");

  const [adjustments, setAdjustments] = useState<any>({
    brightness: 0,
    hue: 0,
    saturation: 0,
    contrast: 0
  });

  const onChangeValue = (value: number) => {
    if (mode in adjustments) {
      setAdjustments((previousValue:any) => ({
        ...previousValue,
        [mode]: value
      }));
    }
  };

  const onReset = () => {
    setMode("crop");
    setAdjustments({
      brightness: 0,
      hue: 0,
      saturation: 0,
      contrast: 0
    });
  };

  const onUpload = (blob: string) => {
    onReset();
    setMode("crop");
    setSrc(blob);
  };

  const onDownload = () => {
    if (cropperRef.current) {
      onNewImage(cropperRef.current
        .getCanvas()
        ?.toDataURL());
      }
  };

  const onUpdate = () => {
    previewRef.current?.refresh();
  };

  const changed = Object.values(adjustments).some((el:any) => Math.floor(el * 100));

  const cropperEnabled = mode === "crop";

  return (
    <div className={"image-editor"}>
      <div className="image-editor__cropper">
        <Cropper
          src={src}
          ref={cropperRef}
          stencilProps={{
            movable: cropperEnabled,
            resizable: cropperEnabled,
            lines: cropperEnabled,
            handlers: cropperEnabled,
            overlayClassName: cn(
              "image-editor__cropper-overlay",
              !cropperEnabled && "image-editor__cropper-overlay--faded"
            )
          }}
          backgroundWrapperProps={{
            scaleImage: cropperEnabled,
            moveImage: cropperEnabled
          }}
          backgroundComponent={AdjustableCropperBackground}
          backgroundProps={adjustments}
          onUpdate={onUpdate}
        />
        {mode !== "crop" && (
          <Slider
            className="image-editor__slider"
            value={adjustments[mode]}
            onChange={onChangeValue}
          />
        )}
        <CropperPreview
          className={"image-editor__preview"}
          ref={previewRef}
          cropper={cropperRef}
          backgroundComponent={AdjustablePreviewBackground}
          backgroundProps={adjustments}
        />
        <Button
          className={cn(
            "image-editor__reset-button",
            !changed && "image-editor__reset-button--hidden"
          )}
          onClick={onReset}
        >
          <ResetIcon />
        </Button>
      </div>
      <Navigation
        mode={mode}
        onChange={setMode}
        onUpload={onUpload}
        onDownload={onDownload}
      />
    </div>
  );
};
