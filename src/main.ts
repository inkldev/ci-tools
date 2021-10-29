import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'
import {bumpVersionCode} from './bump_version_code';

const CMD_BUMP_VERSION_CODE = 'bump_version_code'

async function main() {
    const argv = yargs(hideBin(process.argv))
        .command(CMD_BUMP_VERSION_CODE, "Bump version in the given gradle file", {
            gradle_file: {type: 'string', demandOption: true},
            service_account: {type: 'string', demandOption: true},
            project_number: {type: 'number', demandOption: true},
            app_id: {type: 'string', demandOption: true},
        })
        .demandCommand()
        .parseSync();

    const command = argv._[0];

    switch (command) {
        case CMD_BUMP_VERSION_CODE: {
            await bumpVersionCode(
                argv.service_account as string,
                argv.project_number as number,
                argv.app_id as string,
                argv.gradle_file as string
            )
            break;
        }
    }
}

main().then()
