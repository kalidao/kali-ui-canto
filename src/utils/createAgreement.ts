import { uploadFile } from '~/utils/upload'

export async function createAgreement(name: string, tokenId: string, mission: string) {
  const agreement_params = {
    name: name,
    ricardianId: `7700:${tokenId}`,
    mission: mission,
  }
  try {
    const obj = {
      template_name: 'wyUNA',
      agreement_params: agreement_params,
    }
    const res = await fetch('https://engine.wrappr.wtf/v1/gen', {
      method: 'POST',
      headers: {
        Accept: 'application/pdf',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    })
    const blob = await res.blob()

    if (res.ok) {
      const formData = new FormData()
      formData.append('file', blob, 'agreement.pdf')
      const upload = await uploadFile(formData)
      if (upload) {
        return upload
      }
    } else {
      return Error(`${res.status.toString()} ${res.statusText}`)
    }
  } catch (e) {
    console.error('Error', e)
    return Error(`${e}`)
  }
}
