module.exports = addCoc;

const { readFileSync } = require("fs");
const { join } = require("path");

/**
 * Create a CODE_OF_CONDUCT.md file unless it already exists.
 * Ignores forks and archived repositories
 *
 * @param {import('@octokit/core').Octokit} octokit
 * @param {import('@octokit/types').Endpoints["GET /repos/:owner/:repo"]["response"]["data"]} repository
 * @param {object} options
 */
async function addCoc(octokit, repository, options) {
  if (!options.email) {
    throw new Error("--email argument missing");
  }

  if (repository.fork) {
    octokit.log.info(`${repository.html_url} is a fork, ignoring.`);
    return;
  }

  if (repository.archived) {
    octokit.log.info(`${repository.html_url} is archived, ignoring.`);
    return;
  }

  const cocContent = readFileSync(
    join(__dirname, "CODE_OF_CONDUCT.template.md"),
    "utf-8"
  ).replace("[INSERT EMAIL ADDRESS]", options.email);

  const owner = repository.owner.login;
  const repo = repository.name;

  const hasCoC = await octokit
    .request("HEAD /repos/{owner}/{repo}/contents/{path}", {
      owner,
      repo,
      path: "CODE_OF_CONDUCT.md",
    })
    .then(
      () => true,
      () => false
    );

  if (hasCoC) {
    octokit.log.info(`${repository.html_url} already has a CODE_OF_CONDUCT.md`);
    return;
  }

  octokit.log.info(`Creating CODE_OF_CONDUCT.md for ${repository.html_url}`);

  const { data } = await octokit.request(
    "PUT /repos/{owner}/{repo}/contents/{path}",
    {
      owner,
      repo,
      path: "CODE_OF_CONDUCT.md",
      message: "docs(CODE_OF_CONDUCT): Contributor Covenant",
      content: Buffer.from(cocContent, "utf-8").toString("base64"),
    }
  );

  octokit.log.info(`Created: ${data.content.html_url}`);
}
