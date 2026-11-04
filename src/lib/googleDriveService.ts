/**
 * Google Drive & Workspace Integration Service
 * Cr. Domínguez & Asociados · Document Management Repository
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));
provider.setCustomParameters({
  prompt: 'select_account',
});

// In-memory token storage (Do NOT store in localStorage or sessionStorage per security guidelines)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token not available in memory after refresh; user can reconnect with Google
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('No se pudo obtener el token de acceso de Google Drive.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Error de autenticación Google Drive:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const logoutGoogle = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface DriveFolderInfo {
  id: string;
  name: string;
  webViewLink?: string;
}

export interface DriveFileInfo {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
  size?: string;
  createdTime?: string;
}

/**
 * Finds or creates the dedicated client folder in Google Drive
 * e.g. "Estudio Cr. Domínguez / Patagonia Cloud Software SAS"
 */
export const getOrCreateClientFolder = async (companyName: string): Promise<DriveFolderInfo> => {
  const token = getAccessToken();
  if (!token) throw new Error('No hay sesión activa de Google Drive. Por favor inicia sesión.');

  const folderName = `Estudio Cr. Domínguez · ${companyName}`;

  // Check if folder exists
  const query = encodeURIComponent(`mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`);
  const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!searchRes.ok) {
    throw new Error(`Error al buscar carpeta en Drive: ${searchRes.statusText}`);
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0];
  }

  // Create folder
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      description: `Bóveda Documental y Archivos Fiscales para ${companyName} administrada por Cr. Carlos Rodrigo Domínguez & Asociados`,
    }),
  });

  if (!createRes.ok) {
    throw new Error(`Error al crear carpeta en Google Drive: ${createRes.statusText}`);
  }

  return await createRes.json();
};

/**
 * Uploads a file directly into Google Drive (in the client folder if specified)
 */
export const uploadFileToGoogleDrive = async (
  fileBlob: Blob,
  fileName: string,
  mimeType: string,
  folderId?: string
): Promise<DriveFileInfo> => {
  const token = getAccessToken();
  if (!token) throw new Error('No hay sesión activa de Google Drive.');

  const metadata: any = {
    name: fileName,
    mimeType: mimeType || 'application/octet-stream',
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  // Multipart body
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const reader = new FileReader();
  const fileDataPromise = new Promise<ArrayBuffer>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(fileBlob);
  });

  const arrayBuffer = await fileDataPromise;
  const uint8Array = new Uint8Array(arrayBuffer);

  const metadataBlob = new Blob(
    [
      delimiter,
      'Content-Type: application/json; charset=UTF-8\r\n\r\n',
      JSON.stringify(metadata),
      delimiter,
      `Content-Type: ${mimeType || 'application/octet-stream'}\r\n\r\n`,
    ],
    { type: 'text/plain' }
  );

  const closeBlob = new Blob([closeDelimiter], { type: 'text/plain' });

  const multipartBlob = new Blob([metadataBlob, uint8Array, closeBlob], {
    type: `multipart/related; boundary=${boundary}`,
  });

  const uploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,webContentLink,size,createdTime',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: multipartBlob,
    }
  );

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    throw new Error(`Error al subir a Google Drive: ${errorText}`);
  }

  return await uploadRes.json();
};

/**
 * Lists files inside the client folder in Google Drive
 */
export const listDriveFolderFiles = async (folderId: string): Promise<DriveFileInfo[]> => {
  const token = getAccessToken();
  if (!token) throw new Error('No hay sesión activa de Google Drive.');

  const query = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,webViewLink,webContentLink,size,createdTime)&orderBy=createdTime desc`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    throw new Error(`Error al listar archivos de Google Drive: ${res.statusText}`);
  }

  const data = await res.json();
  return data.files || [];
};

/**
 * Deletes a file from Google Drive (Mandatory user confirmation required in UI before calling)
 */
export const deleteGoogleDriveFile = async (fileId: string): Promise<void> => {
  const token = getAccessToken();
  if (!token) throw new Error('No hay sesión activa de Google Drive.');

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok && res.status !== 404) {
    throw new Error(`Error al eliminar archivo de Google Drive: ${res.statusText}`);
  }
};
