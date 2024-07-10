import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { FaPlus } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { server } from "@/constants";
import { ClipLoader } from "react-spinners";
// import { uploadOnCloudinary } from "@/utils/cloudinary";

const VideoUploadDialog = ({ onUploadComplete }) => {
  const [videoFileName, setVideoFileName] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const onDropVideo = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setVideoFileName(acceptedFiles[0].name);
      setValue("video", acceptedFiles[0]);
    }
  };

  const onDropImage = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setImageFileName(acceptedFiles[0].name);
      setValue("image", acceptedFiles[0]);
    }
  };

  const {
    getRootProps: getVideoRootProps,
    getInputProps: getVideoInputProps,
    isDragActive: isVideoDragActive,
  } = useDropzone({
    onDrop: onDropVideo,
    accept: {
      "video/mp4": [".mp4"],
      "video/webm": [".webm"],
      "video/ogg": [".ogv"],
    },
    multiple: false,
  });

  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive,
  } = useDropzone({
    onDrop: onDropImage,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/gif": [".gif"],
      "image/svg+xml": [".svg"],
    },
    multiple: false,
  });

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "title" || key === "description")
          formData.append(key, data[key]);
      });
      formData.append("thumbNail", data.image);
      formData.append("videoFile", data.video);
      // const file = await uploadOnCloudinary(data.path);
      // console.log(file);
      const response = await axios.post(`${server}/videos/`, formData, {
        withCredentials: true,
      });

      const res = response.data;
      console.log(res);
      reset();
      setVideoFileName("");
      setImageFileName("");
      setIsUploading(false);
      setDialogOpen(false);
      onUploadComplete(); // Trigger the callback to notify the parent component
    } catch (error) {
      console.log(error);
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-purple-500 text-white font-bold flex items-center hover:bg-purple-600"
        >
          <FaPlus className="mr-2" />
          New Video
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black text-white">
        <DialogTitle className="text-white">Video upload</DialogTitle>
        <DialogDescription className="text-gray-400">
          Upload a new video
        </DialogDescription>
        {isUploading && (
          <div className="flex justify-center mt-4">
            <ClipLoader color={"#ffffff"} loading={isUploading} size={50} />
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <label className="block text-sm font-medium text-gray-400 w-24">
            Video:
          </label>
          <div className="mt-2 flex items-center">
            <div
              {...getVideoRootProps()}
              className={`w-full h-24 border-2 ${
                isVideoDragActive
                  ? "border-blue-500"
                  : "border-dashed border-gray-300"
              } rounded cursor-pointer flex items-center justify-center hover:bg-gray-800`}
            >
              <input {...getVideoInputProps()} />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center w-full h-full cursor-pointer"
              >
                {videoFileName
                  ? videoFileName
                  : "Click to upload or drag and drop"}
              </label>
            </div>
          </div>
          {errors.video && (
            <span className="text-red-500">{errors.video.message}</span>
          )}
          <label className="block text-sm font-medium text-gray-400 w-24 mt-2">
            Thumbnail:
          </label>
          <div className="mt-2 flex items-center">
            <div
              {...getImageRootProps()}
              className={`w-full h-24 border-2 ${
                isImageDragActive
                  ? "border-blue-500"
                  : "border-dashed border-gray-300"
              } rounded cursor-pointer flex items-center justify-center hover:bg-gray-800`}
            >
              <input {...getImageInputProps()} />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center w-full h-full cursor-pointer"
              >
                {imageFileName
                  ? imageFileName
                  : "Click to upload or drag and drop image"}
              </label>
            </div>
          </div>
          {errors.image && (
            <span className="text-red-500">{errors.image.message}</span>
          )}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-400">
              Title*
            </label>
            <Input
              className="mt-1 bg-black text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="What is your title?"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <span className="text-red-500">{errors.title.message}</span>
            )}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-400">
              Description*
            </label>
            <textarea
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-black text-white"
              placeholder="e.g. I joined Stripe’s Customer Success team to help them scale their checkout product. I focused mainly on onboarding new customers and resolving complaints."
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <span className="text-red-500">{errors.description.message}</span>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              className="bg-gray-500 text-white font-bold hover:bg-gray-600 mr-2"
              onClick={() => {
                reset();
                setVideoFileName("");
                setImageFileName("");
                setDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-500 text-white font-bold hover:bg-purple-600"
            >
              Finish
            </Button>
          </div>
        </form>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
};

export default VideoUploadDialog;
