import { handleUpload } from 'novel/plugins'

const onUpload = (file: File) => {
  const promise = fetch('/api/upload', {
    method: 'POST',
    headers: {
      'content-type': file?.type || 'application/octet-stream',
      'x-vercel-filename': file?.name || 'image.png'
    },
    body: file
  })

  return new Promise((resolve) => {
    promise.then(async (res) => {
      // Successfully uploaded image
      if (res.status === 200) {
        const { url } = (await res.json()) as { url: string }
        // preload the image
        const image = new Image()
        image.src = url
        image.onload = () => {
          resolve(url)
        }
        // No blob store configured
      } else if (res.status === 401) {
        resolve(file)
        throw new Error(
          '`BLOB_READ_WRITE_TOKEN` environment variable not found, reading image locally instead.'
        )
        // Unknown error
      } else {
        throw new Error('Error uploading image. Please try again.')
      }
    })
  })
}

export const uploadFn = handleUpload(onUpload)
