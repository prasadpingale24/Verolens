import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { ToastContainer,toast } from 'react-toastify';

const Video = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    handleUpload(event.target.files[0]);
  };

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadMessage(`File loaded: ${file.name}`);
    };
    reader.onprogress = (event) => {
      setUploadProgress(Math.round((event.loaded / event.total) * 100));
    };
    reader.readAsDataURL(file);
  };

const handleUploadClick = async () => {
  if (selectedFile) {
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/video', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      if (data.result.classification === 'Real') {
        toast.success('File is not a deepfake!');
      } 
      else {
          toast.error('File is a deepfake!');
      }
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error sending file for detection!');
    }
  } else {
    toast.error('Please select a file first!');
  }
};
  const handleClearClick = () => {
    setSelectedFile(null);
    setUploadMessage('');
    setUploadProgress(0);
  };

  return (
    <div className="bg-zinc-800 min-h-screen">
      <Navbar />
      <div className="bg-zinc-800 h-screen w-full flex justify-center items-center rounded-lg">
        <div className="text-white w-3/4 p-12">
          <h1 className="text-4xl mb-8">Upload a Video to Detect</h1>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
            >
              <div className="flex flex-col items-center justify-center">
                <input
                  id="dropzone-file"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {selectedFile ? (
                  <div>
                    <p className="text-lg mb-2">{selectedFile.name}</p>
                    <p className="text-lg mb-2">{uploadMessage}</p>
                    {uploadProgress > 0 && (
                      <progress
                        className="w-full h-4 mb-2"
                        value={uploadProgress}
                        max="100"
                      />
                    )}
                  </div>
                ) : (
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903 4 4 0 011.602-.98L15.467 19H9a2 2 0 01-2-2V3a2 2 0 012-2h1v10a2 2 0 001 2h3.964a2 2 0 014 0z"
                      />
                    </svg>
                    <p className="text-lg mb-2">Drag and drop or click to select a file</p>
                  </div>
                )}
              </div>
            </label>
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleUploadClick}
            >
              Upload
            </button>
            <ToastContainer />
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
              onClick={handleClearClick}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;