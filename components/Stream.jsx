"use client"

import { useState, useEffect, useRef } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navbar from "../components/Navbar"
import axios from "axios"

const Stream = () => {
  const [stream, setStream] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingStatus, setRecordingStatus] = useState("")
  const [frames, setFrames] = useState([])
  const [countdown, setCountdown] = useState(null)
  // This flag prevents multiple processing of the same recording session
  const [hasProcessed, setHasProcessed] = useState(false)
  // This flag controls when the camera can be restarted after processing
  const [processingComplete, setProcessingComplete] = useState(false)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const recordingInterval = useRef(null)
  const cancelTokenSource = useRef(null)
  // Store request ID to prevent duplicate processing
  const requestIdRef = useRef(null)

  const API_URL = "http://127.0.0.1:5000"

  const stopCam = () => {
    console.log("Stopping webcam...")
    
    // Clear any active frame capture interval
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current)
      recordingInterval.current = null
    }
    
    // Cancel any pending backend request
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel("Camera turned off")
      cancelTokenSource.current = null
    }
    
    // Stop the webcam stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    
    // Reset recording states but keep processing flags intact
    setIsRecording(false)
    setCountdown(null)
    setRecordingStatus("")
  }

  const startCam = () => {
    // Only allow starting camera if not currently processing
    if (isProcessing) return
    
    console.log("Starting webcam...")
    
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        setStream(stream)
        // Reset processing flags for new session
        setHasProcessed(false)
        setProcessingComplete(false)
        requestIdRef.current = null
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          console.log("Webcam started successfully")
        }
      })
      .catch((error) => {
        console.error("Failed to start webcam:", error)
        toast.error("Failed to access webcam. Please check permissions.")
      })
  }

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext("2d")

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    return canvas.toDataURL("image/jpeg")
  }

  const startRecording = () => {
    // Prevent recording if:
    // - No stream available
    // - Already recording or processing
    // - Already processed this session
    if (!stream || isRecording || isProcessing || hasProcessed) {
      console.log("Cannot start recording:", {
        noStream: !stream,
        isRecording,
        isProcessing,
        hasProcessed
      })
      return
    }

    console.log("Starting recording session...")
    setIsRecording(true)
    setFrames([])
    setRecordingStatus("Preparing to record...")

    // Start countdown from 3
    setCountdown(3)
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer)
          beginFrameCapture()
          return null
        }
        return prev - 1
      })
    }, 1000)
  }

  const beginFrameCapture = () => {
    console.log("Beginning frame capture...")
    setRecordingStatus("Recording...")
    
    const totalFrames = 300 // 30fps * 10 seconds
    let frameCount = 0
    const capturedFrames = []

    recordingInterval.current = setInterval(() => {
      // Safety check to prevent capturing after recording should be stopped
      if (frameCount >= totalFrames) {
        console.log("Frame limit reached, stopping capture")
        clearInterval(recordingInterval.current)
        recordingInterval.current = null
        return
      }
      
      const frame = captureFrame()
      if (frame) {
        capturedFrames.push(frame)
        frameCount++
        setRecordingStatus(`Recording: ${frameCount}/${totalFrames} frames`)

        if (frameCount >= totalFrames) {
          console.log("Recording complete, preparing for processing")
          clearInterval(recordingInterval.current)
          recordingInterval.current = null
          
          // Generate a unique request ID for this recording session
          requestIdRef.current = Date.now().toString()
          
          setFrames(capturedFrames)
          setIsRecording(false)
          setRecordingStatus("Recording complete. Processing...")
          
          // Immediately stop the camera to prevent further capture
          stopCam()
          
          // Process the frames with the current request ID
          const currentRequestId = requestIdRef.current
          processFrames(capturedFrames, currentRequestId)
        }
      }
    }, 33.33) // ~30fps
  }

  const processFrames = async (capturedFrames, requestId) => {
    // Do not process if:
    // - This recording has already been processed
    // - The request ID doesn't match the current one (stale request)
    if (hasProcessed || requestId !== requestIdRef.current) {
      console.log("Skipping processing:", {
        hasProcessed,
        requestIdMismatch: requestId !== requestIdRef.current
      })
      return
    }

    console.log(`Processing ${capturedFrames.length} frames...`)
    setIsProcessing(true)
    
    // Create a new cancel token for this request
    cancelTokenSource.current = axios.CancelToken.source()

    try {
      console.log("Sending frames to server...")
      const response = await axios.post(
        `${API_URL}/stream`,
        { 
          frames: capturedFrames,
          requestId: requestId // Send request ID to server
        },
        {
          headers: { "Content-Type": "application/json" },
          cancelToken: cancelTokenSource.current.token,
        }
      )

      console.log("Received response from server:", response.data)
      
      // Only process if this is still the current request and hasn't been processed
      if (!hasProcessed && requestId === requestIdRef.current) {
        if (response.data.result) {
          const { classification, confidence } = response.data.result
          
          if (classification === "Real") {
            toast.success(`Verified as real video (${confidence} confidence)`)
          } else {
            toast.error(`Detected as deepfake (${confidence} confidence)`)
          }
          
          // Mark as processed to prevent duplicate processing
          setHasProcessed(true)
          console.log("Processing complete")
        } else if (response.data.error) {
          console.error("Server error:", response.data.error)
          toast.error(`Error: ${response.data.error}`)
          setHasProcessed(true)
        }
      } else {
        console.log("Ignoring response for stale or already processed request")
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request was cancelled:", error.message)
      } else if (!hasProcessed && requestId === requestIdRef.current) {
        console.error("Failed to process frames:", error)
        toast.error(`Failed to process video: ${error.message}`)
        setHasProcessed(true)
      }
    } finally {
      setIsProcessing(false)
      setRecordingStatus("")
      setProcessingComplete(true)
      cancelTokenSource.current = null
    }
  }

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current)
      }
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel("Component unmounted")
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-zinc-800">
      <Navbar />
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        limit={1} // Limit to 1 toast at a time
      />

      <div className="bg-zinc-800 min-h-screen flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Deepfake Detection System
          </h2>

          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
              <div className="text-white text-6xl font-bold">{countdown}</div>
            </div>
          )}

          <div className="booth relative">
            <video
              id="video"
              ref={videoRef}
              width="100%"
              height="auto"
              autoPlay
              className="w-full h-auto object-cover rounded-md"
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {(isRecording || isProcessing) && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
                {isRecording ? "Recording" : "Processing"}
              </div>
            )}
          </div>

          {recordingStatus && (
            <div className="mt-2 text-center text-gray-700">
              {recordingStatus}
            </div>
          )}

          <div className="flex justify-center gap-4 mt-6">
            {!stream ? (
              <button
                className={`bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors ${
                  isProcessing ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={startCam}
                disabled={isProcessing}
              >
                Start Camera
              </button>
            ) : (
              <>
                <button
                  className={`bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors ${
                    isRecording || isProcessing ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={stopCam}
                  disabled={isRecording || isProcessing}
                >
                  Stop Camera
                </button>

                <button
                  className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors ${
                    isRecording || isProcessing || hasProcessed
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={startRecording}
                  disabled={isRecording || isProcessing || hasProcessed}
                >
                  {isRecording
                    ? "Recording..."
                    : isProcessing
                    ? "Processing..."
                    : "Start Detection"}
                </button>
              </>
            )}
          </div>
          
          {processingComplete && (
            <div className="mt-4 text-center">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
                onClick={() => {
                  // Reset all states and start fresh
                  setHasProcessed(false)
                  setProcessingComplete(false)
                  requestIdRef.current = null;
                  startCam();
                }}
              >
                New Detection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Stream
