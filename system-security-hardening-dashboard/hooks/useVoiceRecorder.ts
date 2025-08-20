import { useState, useRef, useCallback, useEffect } from 'react';

const SILENCE_THRESHOLD = 0.01; // Volume threshold for silence
const SILENCE_DURATION_MS = 6000; // 6 seconds of silence to stop

export const useVoiceRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const silenceTimerRef = useRef<number | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const stopSilenceCheck = useCallback(() => {
        if (silenceTimerRef.current) {
            cancelAnimationFrame(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }
    }, []);
    
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        stopSilenceCheck();
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
        setIsRecording(false);
    }, [stopSilenceCheck]);

    const startSilenceCheck = useCallback(() => {
        if (!analyserRef.current) return;
        
        const analyser = analyserRef.current;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        let silenceStart = Date.now();
        let isSilent = true;

        const check = () => {
            analyser.getByteTimeDomainData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                sum += Math.pow((dataArray[i] / 128.0) - 1, 2);
            }
            const rms = Math.sqrt(sum / dataArray.length);

            if (rms > SILENCE_THRESHOLD) {
                isSilent = false;
                silenceStart = Date.now();
            } else {
                 if (!isSilent) {
                     isSilent = true;
                     silenceStart = Date.now();
                 }
            }
            
            if (isSilent && Date.now() - silenceStart > SILENCE_DURATION_MS) {
                stopRecording();
            } else {
                silenceTimerRef.current = requestAnimationFrame(check);
            }
        };

        silenceTimerRef.current = requestAnimationFrame(check);
    }, [stopRecording]);

    const startRecording = useCallback(async () => {
        if (isRecording) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            const context = audioContextRef.current;
            analyserRef.current = context.createAnalyser();
            sourceRef.current = context.createMediaStreamSource(stream);
            sourceRef.current.connect(analyserRef.current);
            
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            audioChunksRef.current = [];

            recorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
            };

            recorder.start();
            setIsRecording(true);
            startSilenceCheck();

        } catch (err) {
            console.error("Error starting recording:", err);
            // In a real app, you'd want to show an error to the user
        }
    }, [isRecording, startSilenceCheck]);

    const resetRecording = useCallback(() => {
        if(audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        setAudioUrl(null);
    }, [audioUrl]);

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            if (isRecording) {
                stopRecording();
            }
            stopSilenceCheck();
        };
    }, [isRecording, stopRecording, stopSilenceCheck]);

    return { isRecording, startRecording, stopRecording, audioUrl, resetRecording };
};
