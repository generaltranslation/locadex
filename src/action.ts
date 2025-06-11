#!/usr/bin/env node

import * as core from '@actions/core';
import * as github from '@actions/github';
import { exec } from '@actions/exec';

const locadexVersion = '0.1.0-alpha.9';

export async function run(): Promise<void> {
  core.info('Locadex i18n action started');
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
    const githubToken = core.getInput('github_token');

    // PR inputs
    const prBranch = core.getInput('pr_branch');
    const prTitle = core.getInput('pr_title');
    const prBody = core.getInput('pr_body');

    // Set API key as environment variable
    core.exportVariable('ANTHROPIC_API_KEY', apiKey);

    // Build command arguments
    const installArgs = ['npm', 'install', '-g', `locadex@${locadexVersion}`];
    await exec(installArgs[0], installArgs.slice(1));

    // Then run the command without npx
    const args = ['locadex', 'i18n'];

    if (verbose) args.push('--verbose');
    if (debug) args.push('--debug');
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

    await createPR(githubToken, prBranch, prTitle, prBody);
  } catch (error) {
    core.setFailed(`Action failed with error: ${error}`);
  }
}

async function createPR(
  githubToken: string,
  prBranch: string,
  prTitle: string,
  prBody: string
): Promise<void> {
  // Check for changes using git status
  let hasChanges = false;
  try {
    await exec('git', ['diff', '--quiet']);
  } catch {
    hasChanges = true;
  }

  if (!hasChanges) {
    core.info('No changes detected');
    return;
  }

  const context = github.context;
  const octokit = github.getOctokit(githubToken);

  await exec('git', ['config', 'user.name', 'github-actions[bot]']);
  await exec('git', [
    'config',
    'user.email',
    '41898282+github-actions[bot]@users.noreply.github.com',
  ]);
  await exec('git', ['checkout', '-b', prBranch]);
  await exec('git', ['add', '.']);
  await exec('git', ['commit', '-m', 'chore(locadex): update code']);
  await exec('git', ['push', 'origin', prBranch]);

  // Create PR
  const { data: pr } = await octokit.rest.pulls.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    title: prTitle,
    body: prBody,
    head: prBranch,
    base: context.ref,
  });

  core.info(`Created PR: ${pr.html_url}`);
}

run();
