# VeriFace Deepfake Detection System
## Real Time Stream Data with voice
### Realistic or cloned motions detection
- Accept real time stream data
- Extract frames and spectrogram
### mouth shape with phoneme timing
- Web Speech API for phoneme timing from audio
#### Video and audio sync 
- Video -> landmark detection (train model)
- Audio -> spectogram based detection (train model)
- Stream -> bound box around the deepfake user
`Logic`
Loop every 100ms:
    → Analyze video frame & audio segment
    → Compare phoneme timing with mouth movement

If immediate anomaly (e.g., mouth moves, no sound):
    → Trigger instant alert
    
Else if deepfake signs persist for 3 consecutive seconds:
    → Trigger delayed alert (less prone to flickering)
    
Else:
    → Keep collecting data
