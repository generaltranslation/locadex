#!/usr/bin/env node
import * as core from '@actions/core';
import { exec } from '@actions/exec';
export async function run() {
    try {
        // Get inputs
        const apiKey = core.getInput('api_key', { required: true });
        const batchSize = core.getInput('batch_size');
        const maxConcurrent = core.getInput('max_concurrent');
        const verbose = core.getBooleanInput('verbose');
        const debug = core.getBooleanInput('debug');
        const matchFiles = core.getInput('match_files');
        const extensions = core.getInput('extensions');
        const noTelemetry = core.getBooleanInput('no_telemetry');
        // Set API key as environment variable
        core.exportVariable('ANTHROPIC_API_KEY', apiKey);
        // Build command arguments
        const args = ['npx', 'locadex', 'i18n'];
        if (verbose)
            args.push('--verbose');
        if (debug)
            args.push('--debug');
        if (noTelemetry) {
            args.push('--no-telemetry');
        }
        if (batchSize) {
            args.push('--batch-size', batchSize);
        }
        if (maxConcurrent) {
            args.push('--concurrency', maxConcurrent);
        }
        if (matchFiles) {
            args.push('--match-files', matchFiles);
        }
        if (extensions) {
            args.push('--extensions', extensions);
        }
        core.info(`Running command: ${args.join(' ')}`);
        // Execute the command
        await exec(args[0], args.slice(1));
        core.info('Locadex i18n action completed successfully');
    }
    catch (error) {
        core.setFailed(`Action failed with error: ${error}`);
    }
}
run();
