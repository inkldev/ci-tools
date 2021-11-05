import { replaceInFile } from 'replace-in-file'
import { generateAccessToken, getLatestRelease } from './common'

export async function bumpVersionCode(
    appId: string,
    gradleFile: string,
    projectNumber: string,
    serviceAccount: string
) {
    const token = await generateAccessToken(serviceAccount)
    const latestRelease = await getLatestRelease(projectNumber, appId, token)
    const versionCode = parseInt(latestRelease.buildVersion)

    const newVersionCode = versionCode + 1

    console.info(`Bumping version code from ${versionCode} to ${newVersionCode}`)

    await replaceInFile({
        files: gradleFile,
        from: new RegExp('versionCode.+'),
        to: `versionCode ${newVersionCode}`
    })
}
