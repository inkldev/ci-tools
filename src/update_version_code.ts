import { replaceInFile } from 'replace-in-file'
import { generateAccessToken, getLatestRelease } from './common'

export async function updateVersionCode(
    appId: string,
    gradleFile: string,
    projectNumber: string,
    serviceAccount: string,
    offset = 0
) {
    const token = await generateAccessToken(serviceAccount)
    const latestRelease = await getLatestRelease(projectNumber, appId, token)
    const versionCode = parseInt(latestRelease.buildVersion)

    const newVersionCode = versionCode + offset

    console.info(`Updating version code to ${newVersionCode}`)

    await replaceInFile({
        files: gradleFile,
        from: new RegExp('versionCode.+'),
        to: `versionCode ${newVersionCode}`
    })
}
