import { generateAccessToken, getLatestRelease, makeApiRequest } from './common'

export async function inviteTestersToRelease(
    appId: string,
    group: string,
    projectNumber: string,
    serviceAccount: string
): Promise<void> {
    const token = await generateAccessToken(serviceAccount)
    const { name, buildVersion } = await getLatestRelease(projectNumber, appId, token)

    console.info(`Inviting '${group}' testers to app build ${buildVersion}`)

    await makeApiRequest({
        pathname: `v1/${name}:distribute`,
        body: {
            testerEmails: [],
            groupAliases: [group]
        },
        token
    })
}
