import fs from "fs-extra";
import path from "path";
import os from "os";
import logger from "@docusaurus/logger";
import shell from "shelljs";
import { hasSSHProtocol, buildSshUrl, buildHttpsUrl } from "@docusaurus/utils";
import type { ServerInfo } from "@atrilabs/core";
import { ssgOutputPath } from "../shared/utils";

function obfuscateGitPass(str: string) {
  const gitPass = process.env["GIT_PASS"];
  return gitPass ? str.replace(gitPass, "GIT_PASS") : str;
}

function shellExecLog(cmd: string) {
  try {
    const result = shell.exec(cmd);
    logger.info`code=${obfuscateGitPass(cmd)} subdue=${`code: ${result.code}`}`;
    return result;
  } catch (err) {
    logger.error`code=${obfuscateGitPass(cmd)}`;
    throw err;
  }
}

export async function deploy(
  paths: { serverInfo: string; ssgOutput: string },
  serverInfo: ServerInfo
): Promise<void> {
  logger.info("Deploy command invoked...");
  if (!shell.which("git")) {
    throw new Error("Git not installed or on the PATH!");
  }

  // Source repo is the repo from where the command is invoked
  const sourceRepoUrl = shell
    .exec("git config --get remote.origin.url", { silent: true })
    .stdout.trim();

  // The source branch; defaults to the currently checked out branch
  const sourceBranch =
    process.env["CURRENT_BRANCH"] ??
    shell
      .exec("git rev-parse --abbrev-ref HEAD", { silent: true })
      .stdout.trim();

  const gitUser = process.env["GIT_USER"];

  let useSSH =
    process.env["USE_SSH"] !== undefined &&
    process.env["USE_SSH"].toLowerCase() === "true";

  if (!gitUser && !useSSH) {
    // If USE_SSH is unspecified: try inferring from repo URL
    if (process.env["USE_SSH"] === undefined && hasSSHProtocol(sourceRepoUrl)) {
      useSSH = true;
    } else {
      throw new Error(
        "Please set the GIT_USER environment variable, or explicitly specify USE_SSH instead!"
      );
    }
  }

  const { serverInfo: serverInfoPath, ssgOutput } = paths;

  const organizationName =
    process.env["ORGANIZATION_NAME"] ??
    process.env["CIRCLE_PROJECT_USERNAME"] ??
    serverInfo.organizationName;
  if (!organizationName) {
    throw new Error(
      `Missing project organization name. Did you forget to define "organizationName" in ${serverInfoPath}? You may also export it via the ORGANIZATION_NAME environment variable.`
    );
  }
  logger.info`organizationName: name=${organizationName}`;

  const projectName =
    process.env["PROJECT_NAME"] ??
    process.env["CIRCLE_PROJECT_REPONAME"] ??
    serverInfo.projectName;
  if (!projectName) {
    throw new Error(
      `Missing project name. Did you forget to define "projectName" in ${serverInfo}? You may also export it via the PROJECT_NAME environment variable.`
    );
  }

  // We never deploy on pull request.
  const isPullRequest =
    process.env["CI_PULL_REQUEST"] ?? process.env["CIRCLE_PULL_REQUEST"];
  if (isPullRequest) {
    shell.echo("Skipping deploy on a pull request.");
    shell.exit(0);
  }

  const isGitHubPagesOrganizationDeploy = projectName.includes(".github.io");
  if (
    isGitHubPagesOrganizationDeploy &&
    !process.env["DEPLOYMENT_BRANCH"] &&
    !serverInfo.deploymentBranch
  ) {
    throw new Error(`For GitHub pages organization deployments, 'atri publish ssg' does not assume anymore that 'master' is your default Git branch.
Please provide the branch name to deploy to as an environment variable, for example DEPLOYMENT_BRANCH=main or DEPLOYMENT_BRANCH=master .
You can also set the deploymentBranch property in atri-server-info.json .`);
  }

  const deploymentBranch =
    process.env["DEPLOYMENT_BRANCH"] ??
    serverInfo.deploymentBranch ??
    "gh-pages";
  logger.info`deploymentBranch: name=${deploymentBranch}`;

  const githubHost =
    process.env["GITHUB_HOST"] ?? serverInfo.githubHost ?? "github.com";
  const githubPort = process.env["GITHUB_PORT"] ?? serverInfo.githubPort;

  let deploymentRepoURL: string;
  if (useSSH) {
    deploymentRepoURL = buildSshUrl(
      githubHost,
      organizationName,
      projectName,
      githubPort
    );
  } else {
    const gitPass = process.env["GIT_PASS"];
    const gitCredentials = gitPass ? `${gitUser!}:${gitPass}` : gitUser!;
    deploymentRepoURL = buildHttpsUrl(
      gitCredentials,
      githubHost,
      organizationName,
      projectName,
      githubPort
    );
  }

  logger.info`Remote repo URL: name=${obfuscateGitPass(deploymentRepoURL)}`;

  // Check if this is a cross-repo publish.
  const crossRepoPublish = !sourceRepoUrl.endsWith(
    `${organizationName}/${projectName}.git`
  );

  // We don't allow deploying to the same branch unless it's a cross publish.
  if (sourceBranch === deploymentBranch && !crossRepoPublish) {
    throw new Error(
      `You cannot deploy from this branch (${sourceBranch}).` +
        "\nYou will need to checkout to a different branch!"
    );
  }

  // Save the commit hash that triggers publish-gh-pages before checking
  // out to deployment branch.
  const currentCommit = shellExecLog("git rev-parse HEAD").stdout.trim();

  const runDeploy = async (outputDirectory: string) => {
    const fromPath = outputDirectory;
    const toPath = await fs.mkdtemp(
      path.join(os.tmpdir(), `${projectName}-${deploymentBranch}`)
    );
    shell.cd(toPath);

    // Check out deployment branch when cloning repository, and then remove all
    // the files in the directory. If the 'clone' command fails, assume that
    // the deployment branch doesn't exist, and initialize git in an empty
    // directory, check out a clean deployment branch and add remote.
    if (
      shellExecLog(
        `git clone --depth 1 --branch ${deploymentBranch} ${deploymentRepoURL} "${toPath}"`
      ).code === 0
    ) {
      shellExecLog("git rm -rf .");
    } else {
      shellExecLog("git init");
      shellExecLog(`git checkout -b ${deploymentBranch}`);
      shellExecLog(`git remote add origin ${deploymentRepoURL}`);
    }

    try {
      await fs.copy(fromPath, toPath);
    } catch (err) {
      logger.error`Copying build assets from path=${fromPath} to path=${toPath} failed.`;
      throw err;
    }
    shellExecLog("git add --all");

    const commitMessage =
      process.env["CUSTOM_COMMIT_MESSAGE"] ??
      `Deploy website - based on ${currentCommit}`;
    const commitResults = shellExecLog(`git commit -m "${commitMessage}"`);

    if (
      shellExecLog(`git push --force origin ${deploymentBranch}`).code !== 0
    ) {
      throw new Error(
        'Running "git push" command failed. Does the GitHub user account you are using have push access to the repository?'
      );
    } else if (commitResults.code === 0) {
      // The commit might return a non-zero value when site is up to date.
      let websiteURL = "";
      if (githubHost === "github.com") {
        websiteURL = projectName.includes(".github.io")
          ? `https://${organizationName}.github.io/`
          : `https://${organizationName}.github.io/${projectName}/`;
      } else {
        // GitHub enterprise hosting.
        websiteURL = `https://${githubHost}/pages/${organizationName}/${projectName}/`;
      }
      shell.echo(`Website is live at "${websiteURL}".`);
      shell.exit(0);
    }
  };

  runDeploy(ssgOutput);
}

const appServerInfo: ServerInfo = JSON.parse(
  fs.readFileSync("atri-server-info.json").toString()
);

deploy(
  {
    ssgOutput: ssgOutputPath,
    serverInfo: path.resolve("atri-server-info.json"),
  },
  appServerInfo
);
