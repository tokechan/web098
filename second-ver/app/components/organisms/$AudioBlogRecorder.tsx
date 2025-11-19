'use client';

import { useEffect, useRef, useState } from 'hono/jsx';
import { submitAudioBlob } from '../../lib/audioBlogClient';

type RecorderStatus = 'idle' | 'recording' | 'ready' | 'processing' | 'error' | 'success';

type Props = {
  class?: string;
};

export default function AudioBlogRecorder({ class: className }: Props) {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [mdxPreview, setMdxPreview] = useState<string>('');
  const [fileTimestamp, setFileTimestamp] = useState<number | null>(null);
  const [clientSupport, setClientSupport] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioBlobRef = useRef<Blob | null>(null);

  const stopRecordingInternal = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!navigator.mediaDevices || typeof MediaRecorder === 'undefined') {
      setClientSupport(false);
    }

    return () => {
      stopRecordingInternal();
    };
  }, []);

  const handleStartRecording = async () => {
    if (!clientSupport) return;
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        audioBlobRef.current = blob;
        setStatus('ready');
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      mediaStreamRef.current = stream;
      setStatus('recording');
      setMdxPreview('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to access microphone.';
      setError(message);
      setStatus('error');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.stop();
      stopRecordingInternal();
    }
  };

  const handleSubmit = async () => {
    const audioBlob = audioBlobRef.current;
    if (!audioBlob) {
      setError('録音がありません。先に録音してください。');
      setStatus('error');
      return;
    }

    setStatus('processing');
    setError(null);

    try {
      const timestamp = Date.now();
      const mdx = await submitAudioBlob(audioBlob, {
        filename: `audio-${timestamp}.webm`,
      });
      setMdxPreview(mdx);
      setFileTimestamp(timestamp);
      setStatus('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Audio submission failed.';
      setError(message);
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!mdxPreview) return;
    const timestamp = fileTimestamp ?? Date.now();
    const blob = new Blob([mdxPreview], { type: 'text/mdx' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `audio-${timestamp}.mdx`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const isRecording = status === 'recording';
  const isProcessing = status === 'processing';
  const rootClass = ['flex flex-col gap-6', className].filter(Boolean).join(' ');
  const buttonClass =
    'inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-white transition ' +
    'hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60';

  return (
    <div class={rootClass}>
      {!clientSupport && (
        <p role="alert" class="text-red-600">
          このブラウザは MediaRecorder API をサポートしていません。
        </p>
      )}

      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          class={buttonClass}
          disabled={!clientSupport || isRecording}
          onClick={handleStartRecording}
        >
          🎙️ Start Recording
        </button>
        <button type="button" class={buttonClass} disabled={!isRecording} onClick={handleStopRecording}>
          ⏹ Stop Recording
        </button>
        <button
          type="button"
          class={buttonClass}
          disabled={isRecording || isProcessing || !audioBlobRef.current}
          onClick={handleSubmit}
        >
          🚀 Convert to MDX
        </button>
      </div>

      <div class="text-sm text-slate-600">
        {isRecording && <p>録音中... 話し終わったら「Stop Recording」を押してください。</p>}
        {status === 'ready' && <p>録音データの準備ができました。変換ボタンを押してください。</p>}
        {isProcessing && <p>変換中です。数秒お待ちください...</p>}
        {status === 'success' && <p>MDX を生成しました。</p>}
        {status === 'error' && error && (
          <p role="alert" class="text-red-600">
            {error}
          </p>
        )}
      </div>

      <div class="min-h-[240px] rounded-lg border border-dashed border-slate-300 bg-white/30 p-4 shadow-inner">
        {mdxPreview ? (
          <pre class="max-h-[340px] overflow-auto whitespace-pre-wrap text-sm">{mdxPreview}</pre>
        ) : (
          <p>ここに生成された MDX が表示されます。</p>
        )}
      </div>

      <button type="button" class={buttonClass} disabled={!mdxPreview} onClick={handleDownload}>
        💾 audio-{fileTimestamp ?? 'latest'}.mdx をダウンロード
      </button>
    </div>
  );
}
