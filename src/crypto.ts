import crypto, { CipherCCMTypes, CipherGCMTypes, CipherOCBTypes, ScryptOptions, Sign } from 'crypto'

const AUTH_TAG_SIZE = 16
const GENERAL_BYTE_SIZE = 64
const OPTIONS: ScryptOptions = { N: 1024 * 64, maxmem: 1024 * 1024 * 128 }
const FINAL_FORMAT: BufferEncoding = 'base64'
const ENCRYPT_ALGORITHM = 'aes-256-gcm'

export function checkSubjectHash(subject: string, encryptedSubject: string): boolean {
  const encryptedSubjectBuffer = Buffer.from(encryptedSubject, FINAL_FORMAT)
  const salt = encryptedSubjectBuffer.slice(0, GENERAL_BYTE_SIZE)
  const hash = encryptedSubjectBuffer.slice(-GENERAL_BYTE_SIZE)
  const hashForSubject = crypto.scryptSync(subject, salt, GENERAL_BYTE_SIZE, OPTIONS)

  return hashForSubject.equals(hash)
}

export function hashSubject(subject: string): string {
  const salt = crypto.randomBytes(GENERAL_BYTE_SIZE)
  const hash = crypto.scryptSync(subject, salt, GENERAL_BYTE_SIZE, OPTIONS)

  return Buffer.concat([salt, hash]).toString(FINAL_FORMAT)
}

export function encryptSubject(subject: Record<string, any>, secret: string, expiresAt?: number): string {
  const payload = { subject, expiresAt }
  const serializedPayload = JSON.stringify(payload)

  const iv = crypto.randomBytes(GENERAL_BYTE_SIZE)
  const key = crypto.createHash('sha256').update(String(secret)).digest('base64').substring(0, 32)
  const cipher = crypto.createCipheriv(ENCRYPT_ALGORITHM, key, iv, { authTagLength: AUTH_TAG_SIZE } as any)

  const encryptedPayload = Buffer.concat([cipher.update(serializedPayload), cipher.final()])

  return Buffer.concat([iv, encryptedPayload, cipher.getAuthTag()]).toString(FINAL_FORMAT)
}

export function decryptSubject(encryptedSubject: string, secret: string): Record<string, any> {
  const encryptedSubjectBuffer = Buffer.from(encryptedSubject, FINAL_FORMAT)
  const authTag = encryptedSubjectBuffer.slice(-AUTH_TAG_SIZE)
  const iv = encryptedSubjectBuffer.slice(0, GENERAL_BYTE_SIZE)
  const encryptedPayload = encryptedSubjectBuffer.slice(GENERAL_BYTE_SIZE, -AUTH_TAG_SIZE)

  const key = crypto.createHash('sha256').update(String(secret)).digest('base64').substring(0, 32)
  const decipher = crypto.createDecipheriv(ENCRYPT_ALGORITHM, key, iv, { authTagLength: AUTH_TAG_SIZE })

  decipher.setAuthTag(authTag)

  try {
    const serializedPayload = Buffer.concat([decipher.update(encryptedPayload), decipher.final()]).toString()

    return JSON.parse(serializedPayload).subject
  } catch {}
}

export function generateRandomToken(size = GENERAL_BYTE_SIZE, format = FINAL_FORMAT): string {
  return crypto.randomBytes(size).toString(format)
}
