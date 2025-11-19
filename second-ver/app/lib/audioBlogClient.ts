const AUDIO_FIELD = 'audio';
const LOCAL_WORKER_ORIGIN = 'http://127.0.0.1:8788';

const API_BASE = typeof import.meta !== 'undefined'
  ? (import.meta.env?.VITE_AUDIO_WORKER_ORIGIN || (import.meta.env?.DEV ? LOCAL_WORKER_ORIGIN : ''))
  : '';

export type SubmitAudioOptions = {
  filename?: string;
};

export async function submitAudioBlob(blob: Blob, options: SubmitAudioOptions = {}): Promise<string> {
  if (!blob) {
    throw new Error('No audio blob provided.');
  }

  const formData = new FormData();
  const fileName = options.filename ?? 'recording.webm';
  formData.append(AUDIO_FIELD, blob, fileName);

  const response = await fetch(`${API_BASE}/api/audio-blog`, {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'text/plain',
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Audio blog request failed: ${response.status} ${errorText}`);
  }

  return response.text();
}
